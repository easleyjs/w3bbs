w3.bbs - A tribute to 90's PC Bulletin Board Systems (BBSes)
============================================================

## By J. Easley  

-Overview
This project is an attempt to replicate the appearance, features, and experience of accessing a 1990s-era PC-based BBS. The primary focus is replicating the multi-user message board that BBSes provided. While some of the BBS software from the 90's has been modified to accept Telnet connections, and there are some in-browser Java-based Telnet applications, this is an attempt to offer a "native" experience. (And to improve my coding skillz.)

The development stack will be the following:
Model/DB - Django/SQLite (ported to a RDBMS if I have time)
Controller - Django (Views returning JSON)
View - JQueryTerminal

--Feature backlog:
* Implementation and styling of CP437 Vintage IBM font.
* "Last 10 Callers" display on Main menu
* User Profile editor
* Some type of trivia game/text-based game.
* Ports of LORD, TW2002
* Files (downloads section)
* Chat Room
