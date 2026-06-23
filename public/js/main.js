// Auto-hide alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 500);
        }, 5000);
    });
});

// Confirm delete
document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!confirm('Are you sure you want to perform this action?')) {
            e.preventDefault();
        }
    });
});