const bookingSchema = Joi.object({
    travelers: Joi.array()
        .items(
            Joi.object({
                name: Joi.object({
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                }).required(),
            })
        )
        .required(),
});
