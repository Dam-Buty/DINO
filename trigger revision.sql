USE `csstorage2`;
DELIMITER $$

CREATE TRIGGER `type_doc_document_BINS` BEFORE INSERT ON type_doc_document FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one

BEGIN
  SELECT COALESCE(MAX(`revision_type_doc_document`) + 1, 1) 
  INTO @`revision` 
  FROM `type_doc_document` 
  WHERE 
    `fk_client` = NEW.`fk_client` 
    AND `fk_monde` = NEW.`fk_monde` 
    AND ``
  ;
  SET NEW.`Test ID` = @`Test ID`;
END

