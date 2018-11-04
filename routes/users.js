const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rjwt = require("restify-jwt-community");
const User = require("../models/User");
const auth = require("../auth");
const config = require("../config");

module.exports = server => {
  // Get Users
  server.get("/users", async (req, res, next) => {
    try {
      const users = await User.find({});
      res.send(users);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get Single User by ID
  server.get("/users/:id", async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `Es wurde kein User mit der ID: ${req.params.id} gefunden`
        )
      );
    }
  });

  // Get Single User by email
  server.get("/user/:email", async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      res.send(user);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `Es wurde kein User mit der EMail: ${req.params.email} gefunden`
        )
      );
    }
  });

  // Create new User
  server.post(
    "/users",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { email, password, isAdmin } = req.body;

      const user = new User({
        email,
        password,
        isAdmin
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, async (err, hash) => {
          // Hash password
          user.password = hash;
          // Save User
          try {
            const newUser = await user.save();
            res.send(201);
            next();
          } catch (err) {
            return next(new errors.InternalError(err.message));
          }
        });
      });
    }
  );

  // Register User
  server.post("/register", async (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash;
        // Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // Auth User
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // Authenticate User
      const user = await auth.authenticate(email, password);

      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "60m"
      });

      const { iat, exp } = jwt.decode(token);
      // Respond with token
      res.send({ iat, exp, token });

      next();
    } catch (err) {
      // User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });

  // Update User
  server.put(
    "/users/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `Es wurde kein User mit der ID: ${req.params.id} gefunden`
          )
        );
      }
    }
  );

  // Delete Single User
  server.del(
    "/users/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const user = await User.findOneAndRemove({ _id: req.params.id });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `Es wurde kein User mit der ID: ${req.params.id} gefunden`
          )
        );
      }
    }
  );

  // Delete All Users
  server.del(
    "/users/all",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const user = await User.deleteMany();
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `Es wurde kein User mit der ID: ${req.params.id} gefunden`
          )
        );
      }
    }
  );
};
