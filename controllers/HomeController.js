class HomeController{

    async index(req, res){
        res.send("APP COM EXPRESS!");
    }

}

module.exports = new HomeController();