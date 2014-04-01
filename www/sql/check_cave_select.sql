# Check documents dans la cave
SELECT `filename_document`
FROM `document`
WHERE
    `fk_client` = :client
    AND `job_document` = :job
;
