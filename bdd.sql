create table lieu(
	idLieu int PRIMARY KEY AUTO_INCREMENT,
	nom varchar(128),
	coordonneesLAT float,
	coordonneesLONG float
);

create table film(
	idFilm int PRIMARY KEY AUTO_INCREMENT,
	idScene int,
	titre varchar(128),
	realisateur varchar(128),
	annee int,
	genre varchar(64),
	FOREIGN KEY (idScene) REFERENCES scene(idScene)
);

create table scene(
	idScene int PRIMARY KEY AUTO_INCREMENT,
	idFilm int,
	titre varchar(128),
	FOREIGN KEY (idFilm) REFERENCES film(idFilm)
);

create table a_eu_lieu(
	idLieu int,
	idScene int,
	FOREIGN KEY (idLieu) REFERENCES lieu(idLieu),
	FOREIGN KEY (idScene) REFERENCES scene(idScene),
	CONSTRAINT pk_a_eu_lieu PRIMARY KEY (idLieu,idScene)
);