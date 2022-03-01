CREATE TABLE bank
(
  id serial,
  bank character varying(50),
  type character varying(50),
  balance numeric(20,2),
  company_id integer,
  PRIMARY KEY (id),
  FOREIGN KEY (company_id) REFERENCES company(id)
);