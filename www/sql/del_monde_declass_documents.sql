# Suppression de monde : declassification des documents
UPDATE `document`
SET
    `niveau_document` = NULL,
    `date_document` = NULL
WHERE
    `filename_document` = :filename
