var uploadControl = document.querySelector('input[type="file"]');
var maxFiles = 5;
uploadControl.addEventListener('change', function () {
    if (this.files.length > maxFiles) {
        alert('You cannot upload more than ' + maxFiles + ' files.');
        this.value = '';
    }
});
