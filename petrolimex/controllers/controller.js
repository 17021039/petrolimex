module.exports.show = (req,res) => {
    res.render('main', {
        messenger: 'Hello World'
    })
}