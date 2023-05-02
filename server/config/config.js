module.exports = {
  port: process.env.PORT || 5001,
  database: process.env.DATABASE || 'mongodb+srv://rosjanin:SiXMiID9dZ9dFK61@cluster0.e96vmkm.mongodb.net/?retryWrites=true&w=majority',
  jwt_secret: process.env.JWT_SECRET || "1eb401064a8012d3b43dd2a7006e149bdc283b58ac7fbbd38cca307d74bc7a88d4d83480de33a1ca032c8ac437758d098c355fd748b78a6f12ea761f7145432d"
 };