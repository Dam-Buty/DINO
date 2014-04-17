# Superadmin : recupere liste des produits
SELECT
    `pk_produit`,
    `label_produit`
FROM 
    `produit`
ORDER BY
    `pk_produit` ASC
;
