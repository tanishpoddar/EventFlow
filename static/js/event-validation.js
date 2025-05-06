// Event form validation
document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('eventForm');
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');
    const venueSelect = document.getElementById('location_id');
    const durationDisplay = document.getElementById('duration-display');

    if (eventForm) {
        // Time validation
        if (startTimeInput && endTimeInput) {
            [startTimeInput, endTimeInput].forEach(input => {
                input.addEventListener('change', function() {
                    validateTimes();
                    updateDuration();
                });
            });
        }

        // Venue capacity validation
        if (venueSelect) {
            venueSelect.addEventListener('change', validateVenueCapacity);
        }

        // Form submission validation
        eventForm.addEventListener('submit', function(e) {
            if (!validateTimes() || !validateVenueCapacity()) {
                e.preventDefault();
            }
        });
    }

    function validateTimes() {
        if (startTimeInput && endTimeInput) {
            const startTime = startTimeInput.value;
            const endTime = endTimeInput.value;
            
            if (startTime && endTime && startTime >= endTime) {
                alert('End time must be after start time');
                return false;
            }
        }
        return true;
    }

    function validateVenueCapacity() {
        const ticketTypeInputs = document.querySelectorAll('.ticket-type-quantity');
        if (ticketTypeInputs.length > 0 && venueSelect) {
            const selectedVenue = venueSelect.options[venueSelect.selectedIndex];
            const venueCapacity = parseInt(selectedVenue.dataset.capacity || '0');
            
            let totalTickets = 0;
            ticketTypeInputs.forEach(input => {
                totalTickets += parseInt(input.value || '0');
            });

            if (totalTickets > venueCapacity) {
                alert(`Total tickets (${totalTickets}) cannot exceed venue capacity (${venueCapacity})`);
                return false;
            }
        }
        return true;
    }

    function updateDuration() {
        if (startTimeInput && endTimeInput && durationDisplay) {
            const startTime = startTimeInput.value;
            const endTime = endTimeInput.value;

            if (startTime && endTime) {
                const start = new Date(`2000-01-01T${startTime}`);
                const end = new Date(`2000-01-01T${endTime}`);
                
                if (end > start) {
                    const durationMs = end - start;
                    const hours = Math.floor(durationMs / (1000 * 60 * 60));
                    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                    
                    durationDisplay.textContent = `Duration: ${hours}h ${minutes}m`;
                    durationDisplay.style.display = 'block';
                } else {
                    durationDisplay.style.display = 'none';
                }
            }
        }
    }
}); 