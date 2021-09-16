var express = require('express')
const fetch = require('node-fetch')
var router = express.Router()

const movieUrl = `https://api.themoviedb.org/3`
const apikey = `api_key=${process.env.APIKEY}`

router.get('/search', (req, res) => {
    if (!req.query.search) {
        res.status(400)
        res.send('Must include search query param')
        return

    }
    fetch(`${movieUrl}/search/movie?query=${req.query.search}&${apikey}`)
        .then((res) => {
            if (res.status >=400) {
                throw res
            }
            return res.json()
        })
        .then(json => {
            res.json(json)
        })
        .catch((error) => {
            console.log(error)
            res.status(500)
            res.send('there was an error')
        })
})

router.get('/popular', (req, res) => {
    fetch(`${movieUrl}/movie/popular?sort_by=popularity.desc&${apikey}&page=1`)
        .then((res) => {
            if (res.status >= 400) {
                throw res
            }
            return res.json()
        })
        .then(json => {
            res.json(json)
        })
        .catch((error) => {
            console.log(error)
            res.status(500)
            res.send('there was an error')
        })
})

router.get('/top_rated', (req, res) => {
    fetch(`${movieUrl}/movie/top_rated?${apikey}&language=en-US&page=1`)
        .then((res) => {
            if (res.status >= 400) {
                throw res
            }
            return res.json()
        })
        .then(json => {
            res.json(json)
        })
        .catch((error) => {
            console.log(error)
            res.status(500)
            res.send('there was an error')
        })
})

router.get('/upcoming', (req, res) => {
    fetch(`${movieUrl}/movie/upcoming?${apikey}&language=en-US&page=1`)
        .then((res) => {
            if (res.status >= 400) {
                throw res
            }
            return res.json()
        })
        .then(json => {
            res.json(json)
        })
        .catch((error) => {
            console.log(error)
            res.status(500)
            res.send('there was an error')
        })
})

module.exports = router