var maxFiles = 5; // 设置最大文件数量
input.addEventListener('change', function filesSelected() {
    $scope.$apply(function setSelectedFiles() {

        // Only set chosen files selection is not canceled
        if (guacUpload && input.files.length > 0) {
            if (input.files.length <= maxFiles) {
                guacUpload(input.files);
            } else {
                alert('You cannot upload more than ' + maxFiles + ' files.');
            }
        }

        // Reset selection
        form.reset();

    });
});
