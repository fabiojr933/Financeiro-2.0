CREATE TABLE public.company
(
  id serial,
  name character varying(50),
  address character varying(20),
  cnpj character varying(20),
  telephone character varying(20),
  CONSTRAINT company_pkey PRIMARY KEY (id)
);