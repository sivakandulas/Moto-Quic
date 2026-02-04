import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supaClient';
import { useAuth } from './AuthContext';

const BikeContext = createContext();

export function BikeProvider({ children }) {
    const { user } = useAuth(); // Access user state to trigger re-fetches
    const [bikes, setBikes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data on load and when user changes (RLS needs updated auth context)
    useEffect(() => {
        fetchData();
    }, [user]);

    // specific useEffect only for subscriptions
    useEffect(() => {
        // Realtime Subscription
        const channels = supabase.channel('content-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bikes' },
                () => {
                    console.log('Realtime update: Bikes changed');
                    fetchData();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                () => {
                    console.log('Realtime update: Bookings changed');
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channels);
        };
    }, []);

    const fetchData = async () => {
        try {
            // Only set loading on initial load, not background updates
            if (bikes.length === 0) setLoading(true);

            const { data: bikesData, error: bikesError } = await supabase.from('bikes').select('*').order('created_at', { ascending: false });
            if (bikesError) throw bikesError;
            setBikes(bikesData || []);

            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
            if (bookingsError) {
                console.error('[Data] Error fetching bookings:', bookingsError.message);
                throw bookingsError;
            }
            console.log(`[Data] Bookings fetched: ${bookingsData?.length || 0}`);
            setBookings(bookingsData || []);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const addBike = async (newBike) => {
        // Optimistic UI
        const tempId = Date.now();
        const optimisticBike = { ...newBike, id: tempId, status: 'available' };
        setBikes([optimisticBike, ...bikes]);

        const { data, error } = await supabase.from('bikes').insert([{
            name: newBike.name,
            type: newBike.type,
            engine_cc: newBike.engine_cc,
            price_day: newBike.price_day,
            image_url: newBike.image_url,
            grade: 'Mint', // Default
            description: 'Standard Fleet Bike',
            deposit: newBike.deposit || 5000,
            status: 'available'
        }]).select();

        if (error) {
            console.error('Error adding bike:', error.message);
            alert(`Failed to add bike: ${error.message}`);
            fetchData();
        } else {
            alert('Bike added successfully!');
        }
    };

    const deleteBike = async (id) => {
        // Optimistic UI
        const previousBikes = [...bikes];
        setBikes(bikes.filter(b => b.id !== id));

        try {
            // 1. Delete associated bookings first to avoid Foreign Key Constraint error
            const { error: bookingError } = await supabase.from('bookings').delete().eq('bike_id', id);
            if (bookingError) throw bookingError;

            // 2. Delete the bike
            const { error: bikeError } = await supabase.from('bikes').delete().eq('id', id);
            if (bikeError) throw bikeError;

            alert('Bike deleted successfully');
        } catch (error) {
            console.error('Error deleting bike:', error.message);
            alert(`Failed to delete bike: ${error.message}`);
            setBikes(previousBikes); // Revert optimistic update on failure
        }
    };

    const updateBike = async (id, updates) => {
        // Optimistic UI
        setBikes(bikes.map(b => b.id === id ? { ...b, ...updates } : b));

        const { error } = await supabase.from('bikes').update(updates).eq('id', id);

        if (error) {
            console.error('Error updating bike:', error.message);
            alert(`Failed to update bike: ${error.message}`);
            fetchData(); // Revert
        } else {
            alert('Bike updated successfully');
        }
    };

    const checkAvailability = async (bikeId, startDate, endDate) => {
        // Use secure RPC to check availability without exposing all booking data
        const { data: isAvailable, error } = await supabase
            .rpc('check_bike_availability', {
                check_bike_id: bikeId,
                check_start_date: startDate,
                check_end_date: endDate
            });

        if (error) {
            console.error('Error checking availability:', error.message);
            return false;
        }

        return isAvailable;
    };

    const addBooking = async (booking) => {
        // 1. Get Current User (Required for 'My Trips')
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            if (confirm("You must be logged in to book a ride. Go to Login page?")) {
                window.location.href = '/login';
            }
            return false;
        }

        // 2. Check Availability First
        const isAvailable = await checkAvailability(booking.bike_id, booking.start_date, booking.end_date);

        if (!isAvailable) {
            alert('❌ This bike is already booked for those dates. Please choose different dates.');
            return false; // Return failure
        }

        // 3. Optimistic UI (Immediate Feedback)
        const tempId = Date.now();
        const tempBooking = {
            ...booking,
            id: tempId,
            status: 'Pending',
            user_id: user.id
        };
        // Add to TOP of list
        setBookings(prev => [tempBooking, ...prev]);

        // 4. Insert into Supabase (and fetch the real row back)
        const { data: insertedData, error } = await supabase.from('bookings').insert([{
            bike_id: booking.bike_id,
            user_id: user.id, // Link booking to user
            guest_name: booking.guest_name,
            guest_phone: booking.guest_phone,
            start_date: booking.start_date,
            end_date: booking.end_date,
            total_price: booking.total_price,
            status: 'Pending'
        }]).select();

        if (error) {
            console.error('Error adding booking:', error.message);
            alert(`Booking Failed: ${error.message}`);
            // Revert optimistic update
            setBookings(prev => prev.filter(b => b.id !== tempId));
            return false;
        }

        // 5. Success! Update the list with the REAL data from the server
        // This is safer than refetch() because refetch might get stale data if replication is slow
        if (insertedData && insertedData.length > 0) {
            const realBooking = insertedData[0];
            setBookings(prev => [realBooking, ...prev.filter(b => b.id !== tempId)]);
        }

        return true; // Return success
    };

    const updateBookingStatus = async (id, status) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));

        // 1. Update Booking
        const { error: bookingError } = await supabase.from('bookings').update({ status }).eq('id', id);
        if (bookingError) console.error('Error updating booking:', bookingError);

        // 2. Update Bike Status if needed
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            let newBikeStatus = null;
            if (status === 'Active') newBikeStatus = 'busy';
            if (status === 'Completed') newBikeStatus = 'available';

            if (newBikeStatus) {
                setBikes(bikes.map(bike => bike.id === booking.bike_id ? { ...bike, status: newBikeStatus } : bike));
                await supabase.from('bikes').update({ status: newBikeStatus }).eq('id', booking.bike_id);
            }
        }
    };

    return (
        <BikeContext.Provider value={{ bikes, bookings, loading, addBike, deleteBike, addBooking, updateBookingStatus, checkAvailability }}>
            {children}
        </BikeContext.Provider>
    );
}

export function useBikes() {
    return useContext(BikeContext);
}
