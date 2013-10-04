<?php
if ($handle = opendir('esky/')) {
    /* This is the correct way to loop over the directory. */
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo "<a href='esky/" . $entry . "'>" . Toto . "</a><br/>";
        }
    }
    closedir($handle);
}
?>