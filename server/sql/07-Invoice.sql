CREATE TABLE public.invoice
(
  id serial,
  bank character varying(100),
  value_card numeric(10,2),
  bank_id integer,
  user_id integer,
  situation character varying(50),
  data date,
  company_id integer,
  CONSTRAINT fatura_paga_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bank_id FOREIGN KEY (bank_id)
      REFERENCES public.bank (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT invoice_company_id_fkey FOREIGN KEY (company_id)
      REFERENCES public.company (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)