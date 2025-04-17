import Joi from "joi";


const validateOnboardRequest = (data) => {
  const schema = Joi.object({
    clientName: Joi.string().required(),
    uid: Joi.string().required(),
    serverCredentials: Joi.object({
      host: Joi.string().required(),
      port: Joi.number().port(),
      username: Joi.string().required(),
      password: Joi.string().when('privateKey', {
        is: Joi.exist(),
        then: Joi.optional(),
        otherwise: Joi.required()
      }),
      privateKey: Joi.string()
    }).required(),
    wordpressConfig: Joi.object({
      port: Joi.number().port().required(),
      dbUser: Joi.string(),
      dbName: Joi.string(),
      dbPassword: Joi.string(),
      rootPassword: Joi.string(),
      adminEmail: Joi.string().email().required(),
      volumePrefix: Joi.string()
    }).required()
  });

  return schema.validate(data);
};

export default validateOnboardRequest;