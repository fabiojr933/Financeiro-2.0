CREATE TABLE public.users
(
  id serial,
  name character varying(50),
  email character varying(50),
  telephone character varying(20),
  password text,
  date date,
  company_id integer,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT fk_company_id FOREIGN KEY (company_id)
  REFERENCES public.company (id) MATCH SIMPLE
  ON UPDATE NO ACTION ON DELETE NO ACTION
);