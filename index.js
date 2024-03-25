const { create } = require("domain");
const express = require("express");
const mySql = require("mysql2");
const app = express();
const port = 5000;
const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  database: "assignment 3",
});
app.use(express.json());
/////////////////-user APIs///////////////////
//1- add user (user must not found before)
app.post("/add", (req, res, next) => {
  const { name, email, age, password } = req.body;
  connection.execute(
    `select * from users where email ='${email}'`,
    (err, result, field) => {
      if (err) {
        return res.json({ message: "Query Error", err });
      }
      if (result.length > 0) {
        return res.json({ message: "email is already exist" });
      } else {
        connection.execute(
          `insert into users(name , email ,age, password )values('${name}','${email}','${age}','${password}')`,
          (err, result, field) => {
            if (err) {
              return res.json({
                message: "Query Error",
                err,
              });
            }
            return res.json({ message: "Done", result });
          }
        );
      }
    }
  );
});
// 2- update user
app.put("/update/:id", (req, res, next) => {
  const { id } = req.params;
  const { password, age } = req.body;
  connection.execute(
    `update users set password='${password}', age='${age}'where id =${id}`,
    (err, result, field) => {
      if (err) {
        return res.json(err);
      }
      return result.affectedRows
        ? res.json({ message: "done", result })
        : res.json({ message: "id is not valid" });
    }
  );
});
// 3- delete user(user must be found)
app.delete("/delete/:id", (req, res, next) => {
  const { id } = req.params;
  connection.execute(
    `delete from users where id = ${id}`,
    (err, result, field) => {
      if (err) {
        return res.json({ message: "Query Error", err });
      }
      return result.affectedRows
        ? res.json({ message: "done", result })
        : res.json({ message: "id is not valid" });
    }
  );
});
// 4- search for user where his name start with "a" and age less than 30 => using like for characters
app.get("/search", (req, res, next) => {
  connection.execute(
    "SELECT * FROM users WHERE name LIKE 'a%' AND age < 30",
    (err, data) => {
      if (err) {
        res.json({ message: "Query error" });
      }
      res.json({ message: "done", data });
    }
  );
});
// 5- search for users by list of ids => using IN
app.get("/searchIn/:searchKey", (req, res, next) => {
  const { searchKey } = req.params;
  //   console.log(req.query);
  connection.execute(
    `SELECT * FROM users WHERE id IN ${searchKey}`,
    (err, data) => {
      if (err) {
        return res.json({ message: "Query error", err });
      }
      return res.json({ message: "done", data });
    }
  );
});
// 6- get all user
app.get("/", (req, res, next) => {
  connection.execute("select * from users", (err, data) => {
    res.json({ message: "done", data });
  });
});
// 7- get all users with products
app.get("/all", (req, res, next) => {
  connection.execute(
    "SELECT * FROM users INNER JOIN products ON users.id = products.createby",
    (err, data) => {
      if (err) {
        return res.json({ message: "Query error", err });
      }
      return res.json({ message: "done", data });
    }
  );
});
//////////////// -product APIs-///////////////
// 1- add product(product must not found before)
app.post("/addProduct", (req, res, next) => {
  const { id, pName, pDescription, price, createdby } = req.body;
  connection.execute(
    `select * from products where id ='${id}'`,
    (err, result, field) => {
      if (err) {
        return res.json({ message: "Query Error", err });
      }
      if (result.length > 0) {
        return res.json({ message: "product  is already exist " });
      } else {
        connection.execute(
          `insert into users(pName, pDescription, price, createdby)values('${pName}','${pDescription}','${price}','${createdby}')`,
          (err, result, field) => {
            if (err) {
              return res.json({
                message: "Query Error",
                err,
              });
            }
            return res.json({ message: "Done", result });
          }
        );
      }
    }
  );
});
// 2- delete product (product owner only can do this and product must be found )
app.delete("/product/:pid/uId", (req, res, next) => {
  const { pid, uId } = req.params;
  connection.execute(
    `delete from products where id = ${pid} and createby =${uId}`,
    (err, result, field) => {
      if (err) {
        return res.json({ message: "Query Error", err });
      }
      return result.affectedRows
        ? res.json({ message: "done", result })
        : res.json({ message: "id is not valid" });
    }
  );
});

// 3- update product (product owner only)
app.put("/product/:pid/uId", (req, res, next) => {
  const { pName, pDescription, price, createdby } = req.body;
  connection.execute(
    `update products set name = ${pName}, price =${price}, description =${pDescription} , where id = ${req.params.pid} and createby = ${req.params.uId}`,
    (err, result, field) => {
      if (err) {
        return res.json({ message: "Query Error", err });
      }
      return result.affectedRows
        ? res.json({ message: "done", result })
        : res.json({ message: "id is not valid" });
    }
  );
});
// 4- get all products
app.get("/products", (req, res, next) => {
  connection.execute("select * from products", (err, data) => {
    res.json({ message: "done", data });
  });
});
// 5- search for products where price greater than 3000
app.get("/searchProducts", (req, res, next) => {
  const { searchNum } = req.query;
  console.log(searchNum);
  connection.execute(
    `SELECT * FROM products WHERE price > ${searchNum}`,
    (err, data) => {
      if (err) {
        res.json({ message: "Query error", err });
      }
      res.json({ message: "done", data });
    }
  );
});
app.listen(port, () => {
  console.log("server is running .......");
});
