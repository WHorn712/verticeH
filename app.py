from flask import Flask, render_template, url_for, redirect, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/cadastro-empresa', methods=['GET', 'POST'])
def cadastro_empresa():
    if request.method == 'POST':
        # Aqui você pode processar os dados do formulário, salvar no banco, etc.
        # Exemplo: request.form['nome_empresa'], request.files['foto'], etc.
        return redirect(url_for('cadastro_servico'))  # Redireciona para a função que renderiza index.html
    return render_template('cadastro_empresa.html')


@app.route('/cadastro-servico', methods=['GET', 'POST'])
def cadastro_servico():
    if request.method == 'POST':
        # Aqui você pode processar os dados do formulário, salvar no banco, etc.
        # Exemplo: request.form['nome_empresa'], request.files['foto'], etc.
        return redirect(url_for('index'))  # Redireciona para a função que renderiza index.html
    return render_template('cadastro_servico.html')

if __name__ == '__main__':
    app.run(debug=True)