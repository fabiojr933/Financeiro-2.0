
CREATE TABLE public.expense
(
  id serial,
  name character varying(100),
  expense_category_id integer,
  company_id integer,
  user_id integer,
  CONSTRAINT expense_pkey PRIMARY KEY (id),
  CONSTRAINT expense_company_id_fkey FOREIGN KEY (company_id)
      REFERENCES public.company (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT expense_expense_category_id_fkey FOREIGN KEY (expense_category_id)
      REFERENCES public.expense_category (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT expense_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
