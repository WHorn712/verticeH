from flask import Flask, render_template, url_for, redirect, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from urllib.parse import urlparse
import re

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://miaes59lkv7mkp57:o7t8g30qon6276ye@fugfonv8odxxolj8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/h3mxnpksruygjc0y'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuração para upload de arquivos
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Chave secreta para sessões e flash messages
app.secret_key = 'sua_chave_secreta'

# Inicialização do SQLAlchemy e Flask-Migrate
db = SQLAlchemy(app)
migrate = Migrate(app, db)


# Modelos
class Empresa(db.Model):
    __tablename__ = 'cadastro_empresa'

    id = db.Column(db.Integer, primary_key=True)
    nome_empresa = db.Column(db.String(255), nullable=False)
    cnpj = db.Column(db.String(18), nullable=False)
    endereco = db.Column(db.Text, nullable=False)
    celular = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    foto_path = db.Column(db.String(255))
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)

    cnaes = db.relationship('CNAE', backref='empresa', lazy=True, cascade="all, delete-orphan")
    paginas_web = db.relationship('PaginaWeb', backref='empresa', lazy=True, cascade="all, delete-orphan")
    ramos_atuacao = db.relationship('RamoAtuacao', backref='empresa', lazy=True, cascade="all, delete-orphan")
    usuarios = db.relationship('Usuario', backref='empresa', lazy=True, cascade="all, delete-orphan")
    servicos = db.relationship('Servico', backref='empresa', lazy=True, cascade="all, delete-orphan")


class CNAE(db.Model):
    __tablename__ = 'cnae'

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('cadastro_empresa.id'), nullable=False)
    cnae = db.Column(db.String(20), nullable=False)


class PaginaWeb(db.Model):
    __tablename__ = 'pagina_web'

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('cadastro_empresa.id'), nullable=False)
    url = db.Column(db.String(255), nullable=False)


class RamoAtuacao(db.Model):
    __tablename__ = 'ramo_atuacao'

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('cadastro_empresa.id'), nullable=False)
    ramo = db.Column(db.String(255), nullable=False)


class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('cadastro_empresa.id'), nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    celular = db.Column(db.String(20), nullable=False)


class Servico(db.Model):
    __tablename__ = 'servico'

    id = db.Column(db.Integer, primary_key=True)
    empresa_id = db.Column(db.Integer, db.ForeignKey('cadastro_empresa.id'), nullable=False)
    nome_servico = db.Column(db.String(255), nullable=False)
    descricao_servico = db.Column(db.Text, nullable=False)
    preco_normal = db.Column(db.Numeric(10, 2), nullable=False)
    preco_comunidade = db.Column(db.Numeric(10, 2), nullable=False)
    foto_path = db.Column(db.String(255))
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)


# Função para verificar extensões permitidas
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/obrigado/<int:empresa_id>')
def obrigado(empresa_id):
    empresa = Empresa.query.get_or_404(empresa_id)
    return render_template('obrigado.html', empresa=empresa)

@app.route('/cadastro-empresa', methods=['GET', 'POST'])
def cadastro_empresa():
    if request.method == 'POST':
        try:
            # Obter dados do formulário
            nome_empresa = request.form['nome_empresa']
            cnpj = request.form['cnpj']
            endereco = request.form['endereco']
            celular = request.form['celular']
            email = request.form['email']

            # Processar upload de foto
            foto_path = None
            if 'foto' in request.files:
                foto = request.files['foto']
                if foto and foto.filename != '' and allowed_file(foto.filename):
                    filename = secure_filename(foto.filename)
                    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                    filename = f"{timestamp}_{filename}"

                    if not os.path.exists(app.config['UPLOAD_FOLDER']):
                        os.makedirs(app.config['UPLOAD_FOLDER'])

                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    foto.save(filepath)
                    foto_path = filepath

            # Criar nova empresa
            nova_empresa = Empresa(
                nome_empresa=nome_empresa,
                cnpj=cnpj,
                endereco=endereco,
                celular=celular,
                email=email,
                foto_path=foto_path
            )
            db.session.add(nova_empresa)
            db.session.commit()

            # Inserir CNAEs
            cnaes = request.form.getlist('cnae[]')
            for cnae in cnaes:
                if cnae:
                    novo_cnae = CNAE(empresa_id=nova_empresa.id, cnae=cnae)
                    db.session.add(novo_cnae)

            # Inserir páginas web
            paginas_web = request.form.getlist('pagina_web[]')
            for pagina in paginas_web:
                if pagina:
                    nova_pagina = PaginaWeb(empresa_id=nova_empresa.id, url=pagina)
                    db.session.add(nova_pagina)

            # Inserir ramos de atuação
            ramos = request.form.getlist('ramos_atuacao[]')
            for ramo in ramos:
                if ramo:
                    novo_ramo = RamoAtuacao(empresa_id=nova_empresa.id, ramo=ramo)
                    db.session.add(novo_ramo)

            # Inserir usuários
            nomes = request.form.getlist('nome[]')
            emails = request.form.getlist('email[]')
            celulares = request.form.getlist('celular[]')

            for i in range(len(nomes)):
                if nomes[i] and emails[i] and celulares[i]:
                    novo_usuario = Usuario(
                        empresa_id=nova_empresa.id,
                        nome=nomes[i],
                        email=emails[i],
                        celular=celulares[i]
                    )
                    db.session.add(novo_usuario)

            servicos = request.form.getlist('servicos[]')

            for index, servico in enumerate(servicos):
                novo_servico = Servico(
                    empresa_id=nova_empresa.id,
                    nome_servico=servicos[index]['nome'],
                    descricao_servico=servicos[index]['descricao'],
                    preco_normal=servicos[index]['precoNormal'],
                    preco_comunidade=servicos[index]['precoComunidade']
                )
                db.session.add(novo_servico)

            max_index = 0
            # Itera pelas chaves no dicionário request.form
            for key in request.form.keys():
                # Tenta encontrar o padrão 'servicos[número]['
                match = re.match(r'servicos$$(\d+)$$$$', key)
                if match:
                    # Se encontrar, extrai o número dentro dos colchetes
                    index = int(match.group(1))
                    # Atualiza o índice máximo encontrado
                    max_index = max(max_index, index)
            num_servicos = max_index + 1 if max_index >= 0 else 0
            for index in range(num_servicos):
                # Use o índice para construir as chaves corretas e obter os dados
                nome = request.form.get(f'servicos[{index}][nome]')
                descricao = request.form.get(f'servicos[{index}][descricao]')
                preco_normal = request.form.get(f'servicos[{index}][precoNormal]')
                preco_comunidade = request.form.get(f'servicos[{index}][precoComunidade]')

                # Verifique se pelo menos o nome existe para garantir que é um serviço válido (opcional, dependendo da sua lógica)
                if nome:
                    novo_servico = Servico(
                        empresa_id=nova_empresa.id,  # Certifique-se que 'nova_empresa' está disponível neste escopo
                        nome_servico=nome,
                        descricao_servico=descricao,
                        preco_normal=preco_normal,
                        preco_comunidade=preco_comunidade
                    )
                    db.session.add(novo_servico)

            db.session.commit()  # Salve todas as alterações no banco de dados

            flash('Empresa cadastrada com sucesso!', 'success')
            return redirect(url_for('obrigado', empresa_id=nova_empresa.id))

        except Exception as e:
            flash(f'Erro ao cadastrar empresa: {str(e)}', 'error')
            return redirect(url_for('cadastro_empresa'))

    return render_template('cadastro_empresa.html')


@app.route('/cadastro-servico', methods=['GET', 'POST'])
def cadastro_servico():
    if request.method == 'POST':
        try:
            nome_servico = request.form['nome_servico']
            descricao_servico = request.form['descricao_servico']
            preco_normal = request.form['preco_normal'].replace(',', '.')
            preco_comunidade = request.form['preco_comunidade'].replace(',', '.')
            empresa_id = request.form.get('empresa_id')

            foto_path = None
            if 'foto-servico' in request.files:
                foto = request.files['foto-servico']
                if foto and foto.filename != '' and allowed_file(foto.filename):
                    filename = secure_filename(foto.filename)
                    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                    filename = f"{timestamp}_{filename}"

                    if not os.path.exists(app.config['UPLOAD_FOLDER']):
                        os.makedirs(app.config['UPLOAD_FOLDER'])

                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    foto.save(filepath)
                    foto_path = filepath

            novo_servico = Servico(
                empresa_id=empresa_id,
                nome_servico=nome_servico,
                descricao_servico=descricao_servico,
                preco_normal=preco_normal,
                preco_comunidade=preco_comunidade,
                foto_path=foto_path
            )
            db.session.add(novo_servico)
            db.session.commit()

            flash('Serviço cadastrado com sucesso!', 'success')
            return redirect(url_for('index'))

        except Exception as e:
            flash(f'Erro ao cadastrar serviço: {str(e)}', 'error')
            return redirect(url_for('cadastro_servico'))

    return render_template('cadastro_servico.html')


def carregar_dados_banco():
    """
    Carrega e exibe todos os dados existentes no banco de dados.
    Esta função é útil para depuração e verificação do estado do banco.
    """
    print("\n" + "=" * 50)
    print("CARREGANDO DADOS DO BANCO DE DADOS")
    print("=" * 50)

    # Carregar empresas
    empresas = Empresa.query.all()
    print(f"\n>> EMPRESAS CADASTRADAS: {len(empresas)}")
    for empresa in empresas:
        print(f"\nEmpresa ID: {empresa.id}")
        print(f"Nome: {empresa.nome_empresa}")
        print(f"CNPJ: {empresa.cnpj}")
        print(f"Endereço: {empresa.endereco}")
        print(f"Celular: {empresa.celular}")
        print(f"Email: {empresa.email}")
        print(f"Foto: {empresa.foto_path}")
        print(f"Data de Cadastro: {empresa.data_cadastro}")

        # Carregar CNAEs da empresa
        cnaes = CNAE.query.filter_by(empresa_id=empresa.id).all()
        print(f"  CNAEs ({len(cnaes)}):")
        for cnae in cnaes:
            print(f"    - {cnae.cnae}")

        # Carregar páginas web da empresa
        paginas = PaginaWeb.query.filter_by(empresa_id=empresa.id).all()
        print(f"  Páginas Web ({len(paginas)}):")
        for pagina in paginas:
            print(f"    - {pagina.url}")

        # Carregar ramos de atuação da empresa
        ramos = RamoAtuacao.query.filter_by(empresa_id=empresa.id).all()
        print(f"  Ramos de Atuação ({len(ramos)}):")
        for ramo in ramos:
            print(f"    - {ramo.ramo}")

        # Carregar usuários da empresa
        usuarios = Usuario.query.filter_by(empresa_id=empresa.id).all()
        print(f"  Usuários ({len(usuarios)}):")
        for usuario in usuarios:
            print(f"    - {usuario.nome} | {usuario.email} | {usuario.celular}")

    # Carregar serviços
    servicos = Servico.query.all()
    print(f"\n>> SERVIÇOS CADASTRADOS: {len(servicos)}")
    for servico in servicos:
        print(f"\nServiço ID: {servico.id}")
        print(f"Empresa ID: {servico.empresa_id}")
        print(f"Nome: {servico.nome_servico}")
        print(f"Descrição: {servico.descricao_servico}")
        print(f"Preço Normal: R$ {servico.preco_normal}")
        print(f"Preço Comunidade: R$ {servico.preco_comunidade}")
        print(f"Foto: {servico.foto_path}")
        print(f"Data de Cadastro: {servico.data_cadastro}")

    print("\n" + "=" * 50)
    print("FIM DOS DADOS DO BANCO DE DADOS")
    print("=" * 50 + "\n")

if __name__ == '__main__':
    with app.app_context():
        # Carregar dados do banco ao iniciar a aplicação
        carregar_dados_banco()
    app.run(debug=True)

#if __name__ == '__main__':
#    app.run(debug=True)