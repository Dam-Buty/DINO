<?php
echo "TEST : ";
echo $_FILES["document"]["error"];
move_uploaded_file($_FILES['document']['tmp_name'], "../cache/test.pdf");
?>
