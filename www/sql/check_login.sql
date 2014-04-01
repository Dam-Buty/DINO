# Check si un login est libre
SELECT * FROM `user` WHERE `login_user` = :login;
