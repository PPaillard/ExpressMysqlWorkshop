const Joi = require("joi");

const knightSchema = Joi.object({
  name: Joi.string().max(80).required(),
  age: Joi.number().required(),
  is_dubbed: Joi.bool().required(),
});

const validateKnight = (req, res, next) => {
  const { name, age, is_dubbed } = req.body;

  const { error } = knightSchema.validate(
    { name, age, is_dubbed },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = {
  validateKnight,
};
