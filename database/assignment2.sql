-- 1. Add Tony Stark to account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2. Make Tony Stark an Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- 3. Delete Tony Stark
DELETE FROM public.account
WHERE account_id = 1;
-- 4. Update the GM Hummber record
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE (
        inv_make = 'GM'
        AND inv_model = 'Hummer'
    );
-- 5. Find the make and model for inventory in the Sport category.
SELECT i.inv_make,
    i.inv_model
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6. Update file path for inv_image and inv_thumbnail
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');