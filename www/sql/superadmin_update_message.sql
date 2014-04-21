# Superadmin UPDATE message
UPDATE `message`
SET `html_message` = :html
WHERE `pk_message` = :pk
;
