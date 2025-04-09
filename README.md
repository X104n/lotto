# Lotto application

This is a simple application which utilizes the Norsk Tipping API to fetch the combined results of lotto games between two dates.
I have only implemented the normal lotto game and nothing more, even though the API supports more games.

## The API
I found this API in December 2022, and then I could get all the data from one date to another without any problems.
However, when I went back in the summer of 2023 to work more on this project the API was restricted to fetching a maximum of 15 weeks at a time.
I find this a bit funny, and would like to believe that I was the reason for this restriction. For instance I tried pulling all numbers between 01.01.2000 and to the current date at which I worked on the project.
This operation took at least 1 min to complete, and show up in the website.

Feel free to use the API yourself. I will try to implement a better version for this application at [badeklubben.no](https://badeklubben.no).

## The project now

Have used the project to learn about docer, github actions, and how to deploy an application to github pages using actions.
