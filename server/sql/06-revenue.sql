CREATE TABLE public.revenue
(
  id serial,
  name character varying(50),
  user_id integer,
  company_id integer,
  CONSTRAINT revenue_pkey PRIMARY KEY (id),
  CONSTRAINT revenue_company_id_fkey FOREIGN KEY (company_id)
      REFERENCES public.company (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT revenue_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)