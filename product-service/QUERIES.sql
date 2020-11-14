create extension if not exists "uuid-ossp";

create table if not exists products (
    id uuid primary key default uuid_generate_v4(),
    title text,
    description text,
    image text,
    price numeric(6,2)
);

create table if not exists stocks (
	product_id uuid primary key,
	count integer,
	foreign key ("product_id") references "products" ("id")
)


insert into products (id, title, description, image, price) values
    ('de520bff-c47b-40f9-94fe-d62ec00cf5a2', 'ProductOne', 'Short Product Description1', 'https://source.unsplash.com/random?sig=1', 2.4),
    ('b7cf21ad-dbbe-46dd-8cd4-b843aee7901d', 'ProductNew', 'Short Product Description3', 'https://source.unsplash.com/random?sig=2', 10),
    ('c0ba673d-fe2e-4c09-9516-8aa8d02b8cb9', 'ProductTop', 'Short Product Description2', 'https://source.unsplash.com/random?sig=3', 23),
    ('6d6a80a9-6419-4085-99ca-b938be09542f', 'ProductTitle', 'Short Product Description7', 'https://source.unsplash.com/random?sig=4', 15),
    ('583499a5-4a77-4bb0-ac8f-361f47380cab', 'ProductTest', 'Short Product Description4', 'https://source.unsplash.com/random?sig=5', 15),
    ('d2e988b1-c899-4f0b-ac0e-29048b38698d', 'Product2', 'Short Product Descriptio1', 'https://source.unsplash.com/random?sig=6', 23),
    ('0541b053-5651-4994-8e62-ef6be01cc7db', 'ProductName', 'Short Product Description7', 'https://source.unsplash.com/random?sig=7', 15);


insert into stocks (product_id, count) values
    ('de520bff-c47b-40f9-94fe-d62ec00cf5a2', 4),
    ('b7cf21ad-dbbe-46dd-8cd4-b843aee7901d', 6),
    ('c0ba673d-fe2e-4c09-9516-8aa8d02b8cb9', 7),
    ('6d6a80a9-6419-4085-99ca-b938be09542f', 12),
    ('583499a5-4a77-4bb0-ac8f-361f47380cab', 8),
    ('d2e988b1-c899-4f0b-ac0e-29048b38698d', 2),
    ('0541b053-5651-4994-8e62-ef6be01cc7db', 3);

select * from products p left join stocks s on s.product_id = p.id
