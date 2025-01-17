const { query } = require("express");
const express = require("express");
const conexion = require("./database");
const app = express();

//process.env.TZ = 'America/Bogota';

app.use(express.json());

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

app.get("/getAll/:tabla", (req, res) => {
  const tabla = req.params.tabla;
  conexion.query(`SELECT * FROM ${tabla}`, (error, results) => {
    if (error) {
      console.log(error);
    } else if (results != null) {
      res.status(200).send(JSON.stringify(results));
    } else {
      console.log(results);
      res.status(404).send();
    }
  });
});

app.post("/login", (req, res) => {
  const correo = req.body.correo;
  const clave = req.body.clave;
  console.log(correo);
  conexion.query(
    "SELECT correo, clave, Rol_id FROM usuarios WHERE ? AND ?",
    [{ correo: correo }, { clave: clave }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.post("/registrarUsuario", (req, res) => {
  const codigo = req.body.codigo;
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const clave = req.body.clave;
  const Pseguridad = req.body.Pseguridad;
  const Rseguridad = req.body.Rseguridad;
  const Rol_id = req.body.Rol_id;
  conexion.query(
    `SELECT * FROM usuarios WHERE correo='${correo}' OR codigo='${codigo}'`,
    (error, results) => {
      if (error) throw error;
      if (results[0] == undefined) {
        conexion.query(
          `INSERT INTO usuarios (codigo,nombre,correo,clave,Pseguridad,Rseguridad,Rol_id) VALUES('${codigo}',
            '${nombre}','${correo}','${clave}',${Pseguridad},'${Rseguridad}',${Rol_id})`,
          (error, results) => {
            if (error) {
              //brb
              console.log(error);
            } else if (results != null) {
              console.log(results);
              res.status(200).send(JSON.stringify(results["affectedRows"]));
            } else {
              res.status(404).send();
            }
          }
        );
      } else {
        console.log("Duplicated email");
        res.status(412).send();
      }
    }
  );
});
//Users CRUD
app.get("/getUsuario/:correo", (req, res) => {
  const correo = req.params.correo;
  console.log("Consultando a " + correo);
  conexion.query(
    `SELECT * FROM usuarios WHERE correo='${correo}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/getUser/:correo", (req, res) => {
  const correo = req.params.correo;
  console.log("Consultando a " + correo);
  conexion.query(
    `SELECT * FROM usuarios WHERE correo='${correo}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});


app.get('/getUsers', (req,res)=>{
    console.log("getUsers")
    conexion.query(`SELECT * FROM usuarios`,(error,results)=>{
    if(error)
    {
        console.log(error)
    }else if(results!=null){
        console.log(results)
        res.status(200).send(JSON.stringify(results))
    }else{
      res.status(404).send();
    }
  });
});

app.put("/updateUser", (req, res) => {
  const codigo = req.body.codigo;
  const nombre = req.body.nombre;
  const correo = req.body.correo;
  const clave = req.body.clave;
  const Pseguridad = req.body.Pseguridad;
  const Rseguridad = req.body.Rseguridad;
  const Rol_id = req.body.Rol_id;
  console.log("Modificando a :" + codigo);
  conexion.query(
    `UPDATE usuarios SET nombre='${nombre}', clave='${clave}', Pseguridad=${Pseguridad}, Rseguridad='${Rseguridad}', Rol_id=${Rol_id} WHERE codigo=${codigo}`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.patch("/updateOne/:palabras", (req, res) => {
  const palabras = req.params.palabras;
  console.log(palabras);
  const words = palabras.split(",");
  const valor = words[0];
  const campo = words[1];
  const codigo = words[2];
  const tabla = words[3];
  console.log("Modificando a :" + codigo);
  conexion.query(
    `UPDATE ${tabla} SET ${campo}='${valor}' WHERE codigo=${codigo}`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.delete("/deleteUser/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  console.log(codigo);
  conexion.query(
    "DELETE FROM usuarios WHERE ?",
    [{ codigo }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

//↑↑↑↑↑↑va bien↑↑↑↑↑↑

//------------ BICICLETAS

//[ ] registrar bicicleta

app.post("/registerBike", (req, res) => {
  const cedulaPropietario = req.body.cedulaPropietario;
  const fechaRegistro = req.body.fechaRegistro;
  const lugarRegistro = req.body.lugarRegistro;
  const Marca_id = req.body.Marca_id;
  const numSerie = req.body.numSerie;
  const Tipo_id = req.body.Tipo_id;
  const color = req.body.color;
  const Estudiante_id = req.body.Estudiante_id;

  conexion.query(
    `SELECT * FROM bicicletas WHERE numSerie='${numSerie}'`,
    (error, results) => {
      if (error) {
        throw error;
      } else if (results[0] == undefined) {
        conexion.query(
          `INSERT INTO bicicletas (cedulaPropietario,fechaRegistro,lugarRegistro,Marca_id,numSerie,Tipo_id,color,Estudiante_id) 
            VALUES('${cedulaPropietario}','${fechaRegistro}','${lugarRegistro}',${Marca_id},'${numSerie}',${Tipo_id},'${color}','${Estudiante_id}')`,
          (error, results) => {
            if (error) {
              console.log(error);
            } else if (results != null) {
              res.status(200).send(JSON.stringify(results["affectedRows"]));
            } else {
              res.status(404).send();
            }
          }
        );
      } else {
        res.status(412).send();
      }
    }
  );
});

app.get('/getadmBicicletas',(req,res)=>{
    const tabla = req.params.tabla
    conexion.query(`SELECT * FROM bicicletas`,(error,results)=>{
        if(error)
        {
            console.log(error)
        }else if(results!=null){
            res.status(200).send(JSON.stringify(results))
        }
        else{
            console.log(results)
            res.status(404).send()
        }
    })
})

app.get("/getBikes/:Estudiante_id", (req, res) => {
  const Estudiante_id = req.params.Estudiante_id;
  console.log(Estudiante_id);
  conexion.query(
    "SELECT b.idBicicleta, b.cedulaPropietario, b.fechaRegistro, b.lugarRegistro, b.numSerie, t.tipo, b.color, b.Estudiante_id, m.marca FROM bicicletas as b join marcas as m join tipos as t WHERE b.Marca_id=m.id AND b.Tipo_id=t.id AND ?",
    [{ Estudiante_id }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/getBike/:Estudiante_id/:idBicicleta", (req, res) => {
  const Estudiante_id = req.params.Estudiante_id;
  const idBicicleta = req.params.idBicicleta;
  console.log(Estudiante_id);
  conexion.query(
    `SELECT b.idBicicleta, b.cedulaPropietario, b.fechaRegistro, b.lugarRegistro, b.numSerie, t.tipo, b.color, b.Estudiante_id, m.marca FROM bicicletas as b join marcas as m join tipos as t WHERE b.Marca_id=m.id AND b.Tipo_id=t.id AND b.Estudiante_id='${Estudiante_id}' AND b.idBicicleta=${idBicicleta}`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(4);
        console.log(results[0]);
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

//updateBike
//deleteBike

//marcas
app.get("/getMarcas", (req, res) => {
  conexion.query("SELECT * FROM marcas", (error, results) => {
    if (error) {
      console.log(error);
    } else if (results != null) {
      console.log(results);
      res.status(200).send(JSON.stringify(results));
    } else {
      console.log("3");
      console.log(results);
      res.status(404).send();
    }
  });
});

//tipos
app.get("/getTipos", (req, res) => {
  conexion.query("SELECT * FROM tipos", (error, results) => {
    if (error) {
      console.log(error);
    } else if (results != null) {
      console.log(results);
      res.status(200).send(JSON.stringify(results));
    } else {
      console.log("3");
      console.log(results);
      res.status(404).send();
    }
  });
});

app.put("/updateBicicleta", (req, res) => {
  const cedulaPropietario = req.body.cedulaPropietario;
  const fechaRegistro = req.body.fechaRegistro;
  const lugarRegistro = req.body.lugarRegistro;
  const Marca_id = req.body.Marca_id;
  const numSerie = req.body.numSerie;
  const Tipo_id = req.body.Tipo_id;
  const color = req.body.color;
  const Estudiante_id = req.body.Estudiante_id;
  const idBicicleta = req.body.idBicicleta;
  conexion.query(
    `SELECT * FROM bicicletas WHERE numSerie=${numSerie}`,
    (error, results) => {
      //const idBici = results[0].idBicicleta
      if (error) {
        throw error;
      } else if (
        results[0] == undefined ||
        results[0].idBicicleta == idBicicleta
      ) {
        conexion.query(
          `UPDATE bicicletas SET cedulaPropietario='${cedulaPropietario}',fechaRegistro='${fechaRegistro}',lugarRegistro='${lugarRegistro}',Marca_id=${Marca_id},numSerie='${numSerie}',Tipo_id=${Tipo_id},color='${color}' WHERE Estudiante_id='${Estudiante_id}' AND idBicicleta=${idBicicleta}`,
          (error, results) => {
            if (error) {
              console.log(error);
            } else if (results != null) {
              res.status(200).send(JSON.stringify(results["affectedRows"]));
            } else {
              console.log(results);
              res.status(404).send();
            }
          }
        );
      } else {
        res.status(412).send();
      }
    }
  );
});

app.delete('/deleteCupos/:idCupo', (req,res)=>{
    const idCupo = req.params.idCupo
    conexion.query('DELETE FROM cupos WHERE ?',[{idCupo}],(error,results)=>{
    if(error)
    {
        console.log(error)
    }else if(results!=null){
        res.status(200).send(JSON.stringify(results["affectedRows"]))
    }
    else{
        console.log("3")
        console.log(results)
        res.status(404).send()
    }
    })
})

app.get('/get/:codigo', (req,res)=>{
    const codigo = req.params.codigo   
    console.log("Consultando a "+codigo)
    conexion.query(`SELECT * FROM usuarios WHERE correo='${correo}'`,(error,results)=>{
    if(error)
    {
        console.log(error)
    }else if(results!=null){
        res.status(200).send(JSON.stringify(results[0]))
    }
    else{
        console.log("3")
        console.log(results)
        res.status(404).send()
    }
    })
})

app.get('/getOne/:palabras', (req,res)=>{
    const palabras = req.params.palabras
    console.log(palabras)
    const words = palabras.split(',')
    const valor = words[0]
    const campo = words[1]
    const tabla = words[2]
    conexion.query(`SELECT * FROM ${tabla} WHERE ${campo}='${valor}'`, ( error,results) =>{
        if(error)
        {
            console.log(error)
        }else if(results!=null){
            console.log(results)
            res.status(200).send(JSON.stringify(results[0]))
        }
        else{
            console.log(results)
            res.status(404).send()
        }
    })
})

app.get('/getParqueaderos', (req,res)=>{
    conexion.query(`SELECT * FROM parqueaderos`,(error,results)=>{
    if(error)
    {
        console.log(error)
    }else if(results!=null){
        res.status(200).send(JSON.stringify(results))
    }
    else{
        console.log("3")
        console.log(results)
        res.status(404).send()
    }
    })
})

app.post('/registerParqueadero/:parqueadero', (req, res) => {
    const parqueadero = req.params.parqueadero
    const words = parqueadero.split(',')
    const Bicicleta_idBicicleta = words[0]
    const Cupo_idCupo = words[1]
    conexion.query(`SELECT * FROM parqueaderos WHERE Bicicleta_idBicicleta=${Bicicleta_idBicicleta}`,(error,results)=>{
        if(error){
            throw error
        }else if(results[0]==undefined){
            conexion.query(`INSERT INTO parqueaderos (Bicicleta_idBicicleta,Cupo_idCupo) 
            VALUES ('${Bicicleta_idBicicleta}',${Cupo_idCupo})`,(error,results)=>{
            if(error)
            {
                console.log(error)
            }else if(results!=null){
                conexion.query(`UPDATE cupos SET estado=1 WHERE idCupo=${Cupo_idCupo}`,(error,results)=>{
                    if(error){
                        throw error
                    }else{
                        res.status(200).send(JSON.stringify(results))
                    }
                })        
            }
          }
        );
      } else {
        res.status(412).send();
      }
    }
  );
});

app.delete("/deleteBicicleta/:idBicicleta", (req, res) => {
  const idBicicleta = req.params.idBicicleta;
  conexion.query(
    "DELETE FROM bicicletas WHERE ?",
    [{ idBicicleta }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/getCupo/:seccion", (req, res) => {
  const seccion = req.params.seccion;
  conexion.query(
    `SELECT * FROM cupos WHERE seccion='${seccion}' AND estado=0`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results));
      } else {
        res.status(404).send();
      }
    }
  );
});

app.get("/getCupos", (req, res) => {
  conexion.query(`SELECT * FROM cupos`, (error, results) => {
    if (error) {
      console.log(error);
    } else if (results != null) {
      res.status(200).send(JSON.stringify(results));
    } else {
      res.status(404).send();
    }
  });
});

app.put("/updateCupo", (req, res) => {
  const idCupo = req.body.idCupo;
  const seccion = req.body.seccion;
  const estado = req.body.estado;
  conexion.query(
    `UPDATE cupos SET seccion='${seccion}', estado=${estado} WHERE idCupo=${idCupo}`,
    (error, results) => {
      console.log("updateCupo = ",results)
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.delete("/deleteCupos/:idCupo", (req, res) => {
  const idCupo = req.params.idCupo;
  conexion.query(
    "DELETE FROM cupos WHERE ?",
    [{ idCupo }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/get/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  console.log("Consultando a " + codigo);
  conexion.query(
    `SELECT * FROM usuarios WHERE correo='${correo}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/getOne/:palabras", (req, res) => {
  const palabras = req.params.palabras;
  console.log(palabras);
  const words = palabras.split(",");
  const valor = words[0];
  const campo = words[1];
  const tabla = words[2];
  conexion.query(
    `SELECT * FROM ${tabla} WHERE ${campo}='${valor}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.post("/registerParqueadero/:parqueadero", (req, res) => {
  const parqueadero = req.params.parqueadero;
  const words = parqueadero.split(",");
  const Bicicleta_idBicicleta = words[0];
  const Cupo_idCupo = words[1];
  conexion.query(
    `SELECT * FROM parqueaderos WHERE Bicicleta_idBicicleta=${Bicicleta_idBicicleta}`,
    (error, results) => {
      if (error) {
        throw error;
      } else if (results[0] == undefined) {
        conexion.query(
          `INSERT INTO parqueaderos (Bicicleta_idBicicleta,Cupo_idCupo) 
            VALUES ('${Bicicleta_idBicicleta}',${Cupo_idCupo})`,
          (error, results) => {
            if (error) {
              console.log(error);
            } else if (results != null) {
              conexion.query(
                `UPDATE cupos SET estado=1 WHERE idCupo=${Cupo_idCupo}`,
                (error, results) => {
                  if (error) {
                    throw error;
                  } else {
                    res.status(200).send(JSON.stringify(results));
                  }
                }
              );
            } else {
              res.status(404).send();
            }
          }
        );
      } else {
        res.status(412).send();
      }
    }
  );
});

app.get("/getParqueadero/:seccion", (req, res) => {
  const seccion = req.params.seccion;
  conexion.query(
    `SELECT b.idBicicleta, b.cedulaPropietario, b.fechaRegistro, b.lugarRegistro, b.numSerie,  t.tipo, b.color, b.Estudiante_id,  u.nombre as marca
    FROM bicicletas as b 
    JOIN parqueaderos as p 
    JOIN tipos as t 
    JOIN usuarios as u
    JOIN cupos as c ON  b.Tipo_id=t.id 
    AND b.idBicicleta=p.Bicicleta_idBicicleta 
    AND p.Cupo_idCupo=c.idCupo 
    AND b.Estudiante_id = u.codigo
    AND c.seccion ='${seccion}'`,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.status(200).send(JSON.stringify(results));
      }
    }
  );
});

app.delete("/deleteParqueadero/:idBicicleta", (req, res) => {
  const idBicicleta = req.params.idBicicleta;
  conexion.query(
    `SELECT Cupo_idCupo FROM parqueaderos WHERE Bicicleta_idBicicleta=${idBicicleta}`,
    (error, results) => {
      console.log(results);
      if (error) {
        throw error;
      } else {
        //const idCupo = results[0].Cupo_idCupo
        conexion.query(
          `UPDATE cupos SET estado=0 WHERE idCupo=${results[0].Cupo_idCupo}`,
          (error, results) => {
            if (error) {
              throw error;
            } else {
              conexion.query(
                `DELETE FROM parqueaderos WHERE Bicicleta_idBicicleta=${idBicicleta}`,
                (error, results) => {
                  if (error) {
                    throw error;
                  } else {
                    res
                      .status(200)
                      .send(JSON.stringify(results["affectedRows"]));
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.get("/getBikeForDesasignar/:numSerie", (req, res) => {
  const numSerie = req.params.numSerie;
  console.log(numSerie);
  conexion.query(
    `SELECT b.idBicicleta, u.nombre , t.tipo, b.color FROM bicicletas as b JOIN usuarios as u JOIN tipos as t
     ON b.numSerie=${numSerie} 
     AND b.Estudiante_id=u.codigo
     AND b.Tipo_id=t.id`,
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.status(200).send(JSON.stringify(results[0]));
      }
    }
  );
});

app.get("/getSlots", (req, res) => {
  conexion.query(`SELECT * FROM cupos`, (error, results) => {
    if (error) {
      console.log(error);
    } else if (results != null) {
      res.status(200).send(JSON.stringify(results));
    } else {
      console.log("3");
      console.log(results);
      res.status(404).send();
    }
  });
});

app.get("/getSlot/:idCupo", (req, res) => {
  const idCupo = req.params.idCupo;
  console.log("Consultando a " + idCupo);
  conexion.query(
    `SELECT * FROM cupos WHERE idCupo='${idCupo}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.put("/updateSlots", (req, res) => {
  const idCupo = req.body.idCupo;
  const seccion = req.body.seccion;
  const estado = req.body.estado;

  conexion.queryconexion.queryconexion.query(
    `UPDATE cupos SET seccion=${seccion}, estado='${estado}' WHERE idCupo='${idCupo}'`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send();
      } else {
        res.status(404).send();
      }
    }
  );
});

app.delete("/deleteSlots/:idCupo", (req, res) => {
  const idCupo = req.params.idCupo;
  console.log(idCupo);
  conexion.query(
    "DELETE FROM cupos WHERE ?",
    [{ idCupo }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.post("/updatePassword", (req, res) => {
  const codigo = req.body.codigo;
  const Pseguridad = req.body.Pseguridad;
  const Rseguridad = req.body.Rseguridad;
  const clave = req.body.clave;
  conexion.query(
    `SELECT * FROM usuarios WHERE codigo='${codigo}' AND Pseguridad=${Pseguridad} AND Rseguridad='${Rseguridad}'`,
    (error, results) => {
      if (error) throw error;
      console.log(results.length == 0);
      if (results.length != 0) {
        conexion.query(
          `UPDATE usuarios SET clave='${clave}' WHERE codigo='${codigo}'`,
          (error, results) => {
            if (error) {
              console.log(error);
            } else if (results != null) {
              console.log(results);
              res.status(200).send(JSON.stringify(results["affectedRows"]));
            } else {
              res.status(404).send();
            }
          }
        );
      } else {
        res.status(412).send();
      }
    }
  );
});


app.get("/getRoles" , (req,res) =>{
    console.log("getroles ejecutado")
    conexion.query(`SELECT * FROM roles` , (error,results)=>{
        if(error) throw error
        else if(results!=null){
            console.log(results)
            res.status(200).send(JSON.stringify(results))
        }else{
            res.status(404).send()
        }

    })
})

app.post("/updatePassword", (req, res) => {
  const codigo = req.body.codigo;
  const Pseguridad = req.body.Pseguridad;
  const Rseguridad = req.body.Rseguridad;
  const clave = req.body.clave;
  conexion.query(
    `SELECT * FROM usuarios WHERE codigo='${codigo}' AND Pseguridad=${Pseguridad} AND Rseguridad='${Rseguridad}'`,
    (error, results) => {
      //lo probe de muchas formas xd y ajam puse mil codigos hay pero me da error el post pille, coje disq undefined los values
      if (error) throw error;
      console.log(results.length == 0);
      console.log(results);
      if (results.length != 0) {
        conexion.query(
          `UPDATE usuarios SET clave='${clave}' WHERE codigo='${codigo}'`,
          (error, results) => {
            //aca
            if (error) {
              //brb
              console.log(2);
              console.log(error);
            } else if (results != null) {
              console.log(3);
              console.log(results);
              res.status(200).send(JSON.stringify(results["affectedRows"]));
            } else {
              res.status(404).send();
            }
          }
        );
      } else {
        res.status(412).send();
      }
    }
  );
});


//Reportes

app.get("/getControlBicicletas", (req,res) => {
  conexion.query("SELECT * FROM control_bicicletas", (error, results) => {
    if (error) throw error;
    else if(results!=null)
    {
        res.status(200).send(JSON.stringify(results))
    }
    else{
      res.status(404).send();
    }
  })
});


app.get("/getControlParqueaderos", (req,res) => {
  console.log("hola")
  conexion.query("SELECT * FROM control_parqueaderos", (error, results) => {
    if (error) throw error;
    else if(results!=null)
    {
      console.log(results)
        res.status(200).send(JSON.stringify(results))
    }
    else{
      res.status(404).send();
    }
  })
});

app.get("/getControlUsuarios", (req,res) => {
  conexion.query("SELECT * FROM control_usuarios", (error, results) => {
    if (error) throw error;
    else if(results!=null)
    {
        res.status(200).send(JSON.stringify(results))
    }
    else{
      res.status(404).send();
    }
  })
});

app.put("/updateMarca",(req,res)=>{
  const id = req.body.id
  const marca = req.body.marca
  conexion.query(`UPDATE marcas SET marca='${marca}' WHERE id=${id}`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(404).send();
    }
  })
})

app.get("/getMarca/:id", (req, res) => {
 const id = req.params.id
  conexion.query(`SELECT * FROM marcas WHERE id=${id}`, (error, results) => {
    if (error) {
      throw error
    } else if (results != null) {
      res.status(200).send(JSON.stringify(results[0]));
    } else {
      res.status(404).send();
    }
  });
});

app.delete("/deleteMarca/:id",(req,res)=>{
  const id = req.params.id
  console.log(id)
  conexion.query(`DELETE FROM marcas WHERE id=${id}`,(error,results)=>{
    if(error){
      throw error
    }else{
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }
  })
})

app.post("/createMarca",(req,res)=>{
  const id = req.body.id
  const marca = req.body.marca
  conexion.query(`INSERT INTO marcas (marca) VALUES ('${marca}')`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(404).send()
    }
  })
})

app.put("/updateParqueadero/:palabras",(req,res)=>{
    const palabras = req.params.palabras
    const words = palabras.split(',')
    const Bicicleta_idBicicleta = words[0]
    const Cupo_idCupo = words[1]
    const Cupo_idCupo2= words[2]
    const Bicicleta_idBicicleta2 = words[3]
    console.log(palabras)
    conexion.query(`SELECT idParqueadero FROM parqueaderos WHERE Bicicleta_idBicicleta=${Bicicleta_idBicicleta2}`,(error,results)=>{
        if(error){
            throw error
        }else if(results[0]!=undefined){
          console.log("encontro parqueadero")
          conexion.query(`UPDATE parqueaderos SET Bicicleta_idBicicleta=${Bicicleta_idBicicleta}, Cupo_idCupo=${Cupo_idCupo} WHERE idParqueadero=${results[0].idParqueadero}`,(error,results)=>{
            if(error){
              throw error
            }else if(results!=null){
              conexion.query(`UPDATE cupos SET estado=1 WHERE idCupo=${Cupo_idCupo}`,(error,results)=>{
                if(error){
                    throw error
                }else{
                  conexion.query(`UPDATE cupos SET estado=0 WHERE idCupo=${Cupo_idCupo2}`,(error,results)=>{
                    if(error){
                        throw error
                    }else{
                        res.status(200).send(JSON.stringify(results["affectedRows"]))
                    }
                });
                }
            }); 
            }else{
              res.status(404).send()
            }
          });
      } else {
        res.status(412).send();
      }
    }
  );  
})

app.get("/getbicicletasSinUso/",(req,res)=>{
conexion.query(`SELECT * FROM bicicletas EXCEPT SELECT b.* FROM parqueaderos AS P JOIN bicicletas AS b WHERE b.idBicicleta=p.Bicicleta_idBicicleta`,(error,results)=>{
  if(error){
    throw error
  }else if(results!=null){
    res.status(200).send(results)
  }else{
    res.status(404).send()
  }
})
})
app.get("/getCupoa/:idCupo", (req, res) => {
  const idCupo = req.params.idCupo;
  conexion.query(
    `SELECT * FROM cupos WHERE idCupo='${idCupo}'`,
    (error, results) => {
      console.log("id",idCupo,"resultados",results)
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results[0]));
      } else {
        res.status(404).send();
      }
    }
  );
});

app.delete("/deletePregunta/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  console.log(codigo);
  conexion.query(
    "DELETE FROM preguntas WHERE ?",
    [{ codigo }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.post("/createCupo",(req,res)=>{
  const seccion = req.body.seccion
  const estado = req.body.estado
  conexion.query(`INSERT INTO cupos (seccion,estado) VALUES ('${seccion}',${estado})`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(404).send()
    }
  })
})

app.post("/createPregunta",(req,res)=>{
  const pregunta = req.body.pregunta
  conexion.query(`INSERT INTO preguntas (pregunta) VALUES ('${pregunta}')`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(404).send()
    }
  })
})

app.post("/createRol",(req,res)=>{
  const codigo = req.body.codigo
  const rol = req.body.rol
  conexion.query(`INSERT INTO roles (codigo,rol) VALUES (${codigo},'${rol}')`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(404).send()
    }
  })
})

app.delete("/deleteRol/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  console.log(codigo);
  conexion.query(
    "DELETE FROM roles WHERE ?",
    [{ codigo }],
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log("3");
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/getRol/:codigo", (req, res) => {
  const codigo = req.params.codigo
   conexion.query(`SELECT * FROM roles WHERE codigo=${codigo}`, (error, results) => {
     if (error) {
       throw error
     } else if (results != null) {
       res.status(200).send(JSON.stringify(results[0]));
     } else {
       res.status(404).send();
     }
   });
 });

 app.put("/updateRol", (req, res) => {
  const codigo = req.body.codigo;
  const rol = req.body.rol;
  conexion.query(
    `UPDATE roles SET rol='${rol}' WHERE codigo=${codigo}`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.get("/getPregunta/:codigo", (req, res) => {
  const codigo = req.params.codigo
   conexion.query(`SELECT * FROM preguntas WHERE codigo=${codigo}`, (error, results) => {
     if (error) {
       throw error
     } else if (results != null) {
       res.status(200).send(JSON.stringify(results[0]));
     } else {
       res.status(404).send();
     }
   });
 });

 app.put("/updatePregunta", (req, res) => {
  const codigo = req.body.codigo;
  const pregunta = req.body.pregunta;
  conexion.query(
    `UPDATE preguntas SET pregunta='${pregunta}' WHERE codigo=${codigo}`,
    (error, results) => {
      console.log(pregunta)
      if (error) {
        console.log(error);
      } else if (results != null) {
        console.log(results);
        res.status(200).send(JSON.stringify(results["affectedRows"]));
      } else {
        console.log(results);
        res.status(404).send();
      }
    }
  );
});

app.post("/crearTipo/",(req,res)=>{
  const tipo = req.body.tipo
  conexion.query(`INSERT INTO tipos (tipo) VALUES ('${tipo}')`,(error,results)=>{
    console.log(results)
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(400).send()
    }
  })
})

app.put("/updateTipo",(req,res)=>{
  const id = req.body.id
  const tipo = req.body.tipo
  conexion.query(`UPDATE tipos SET tipo='${tipo}' WHERE id=${id}`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(400).send()
    }
  })
})

app.delete("/deleteTipo/:id",(req,res)=>{
  const id = req.params.id
  conexion.query(`DELETE FROM tipos WHERE id=${id}`,(error,results)=>{
    if(error){
      throw error
    }else if(results!=null){
      res.status(200).send(JSON.stringify(results["affectedRows"]))
    }else{
      res.status(404).send()
    }
  })
})

app.get("/getReporteEntradas/:codigo/:numSerie", (req,res) => {
  const codigo = req.params.codigo;
  const numSerie = req.params.numSerie;

  conexion.query(`SELECT * FROM sdjcomp2.control_parqueaderos where Estudiante_id like '%${codigo}%' AND numSerie like '%${numSerie}%'`, (error, results) => {
    console.log(codigo);
    console.log(numSerie);
    if (error) throw error;
    else if(results!=null)
    {
        //results[0].arrived_time += 5;
        console.log(results);
        res.status(200).send(JSON.stringify(results))
    }
    else{
      res.status(404).send();
    }
  })
});

app.get("/getReporteBiciCiudad/:ciudad", (req,res) => {
  const ciudad = req.params.ciudad;
conexion.query(`SELECT * FROM sdjcomp2.control_bicicletas where lugarRegistro like '%${ciudad}%'`, (error, results) => {
  if (error) throw error;
  else if(results!=null)
  {
      //results[0].arrived_time += 5;
      console.log(results);
      res.status(200).send(JSON.stringify(results))
  }
  else{
    res.status(404).send();
  }
})
});

app.get("/getReporteUsoDeParqueaderos/:uso", (req,res) => {
  const uso = req.params.uso;
conexion.query(`SELECT idCupo, seccion, idParqueadero, numSerie, color, Estudiante_id, arrived_time, departure_time, case 0 when TIMEDIFF(departure_time, arrived_time) then TIMEDIFF(now(), arrived_time) else TIMEDIFF(departure_time, arrived_time) end as "fechaRegistro", status FROM sdjcomp2.control_parqueaderos where status like '%${uso}%'`, (error, results) => {
  if (error) throw error;
  else if(results!=null)
  {
      //results[0].arrived_time += 5;
      console.log(results);
      res.status(200).send(JSON.stringify(results))
  }
  else{
    res.status(404).send();
  }
})
});
