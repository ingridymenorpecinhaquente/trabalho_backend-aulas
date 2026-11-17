
// npm init -> cria o pacote inicial API
// npm i express
const express = require("express")
const app = express()
app.use(express.json())
const port = 3000
// npm i mysql2
const db = require("./db")

app.get("/aula", async (req, res) => {
    try {
        const resultado = await db.pool.query("SELECT * FROM aula")
        res.status(200).json(resultado[0])
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

app.post("/aula", async (req, res) => {
    try {
        const dados = req.body
        const resultado = await db.pool.query(
            "INSERT INTO aula (serie, turma, componente, professor) VALUES (?, ?, ?, ?)",
            [dados.serie, dados.turma, dados.componente, dados.professor]
        )
        res.status(201).json(
            {resultado: "Aula cadastrada, ID = " + resultado[0].insertId}
        )
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

// DELETE /aula/:id
app.delete("/aula/:id", async (req, res) => {
    try {
        const id = req.params.id
        const resultado = await db.pool.query(
            "DELETE FROM aula WHERE id = ?", [id]
        )

        if (resultado[0].affectedRows === 0) {
            return res.status(404).json({erro: "Aula não encontrada"})
        }

        res.status(200).json({resultado: "Aula excluída com sucesso"})
    } catch (erro) {
        if (erro.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                erro: "Não é possível excluir: existem horários vinculados a esta aula"
            })
        }
        res.status(500).json({erro: erro.message})
    }
})

// POST /horario
app.post("/horario", async (req, res) => {
    try {
        const dados = req.body

        if (!dados.idaula || !dados.dia_semana || dados.ordem == null) {
            return res.status(400).json({erro: "Informe idaula, dia_semana e ordem"})
        }

        const aula = await db.pool.query(
            "SELECT id FROM aula WHERE id = ?", [dados.idaula]
        )

        if (aula[0].length === 0) {
            return res.status(404).json({erro: "Aula não encontrada"})
        }

        const resultado = await db.pool.query(
            "INSERT INTO horario_aula (idaula, dia_semana, ordem) VALUES (?, ?, ?)",
            [dados.idaula, dados.dia_semana, dados.ordem]
        )

        res.status(201).json({
            resultado: "Horário cadastrado, ID = " + resultado[0].insertId
        })
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

// GET /horario/:dia
app.get("/horario/:dia", async (req, res) => {
    try {
        const dia = req.params.dia
        const resultado = await db.pool.query(
            "SELECT * FROM horario_aula WHERE dia_semana = ?", [dia]
        )
        res.status(200).json(resultado[0])
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

// DELETE /horario/:id
app.delete("/horario/:id", async (req, res) => {
    try {
        const id = req.params.id
        const resultado = await db.pool.query(
            "DELETE FROM horario_aula WHERE id = ?", [id]
        )

        if (resultado[0].affectedRows === 0) {
            return res.status(404).json({erro: "Horário não encontrado"})
        }

        res.status(200).json({resultado: "Horário excluído com sucesso"})
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

app.listen(port, () => {
    console.log("API rodando na porta " + port)
})

// No Rapid Client:
// GET http://127.0.0.1:3000/aula
