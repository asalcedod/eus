# EUS - Sistema de Encuestas y Noticias para Egresados de la Universidad de Sucre

## Proceso de Instalación

Esta página web corre utilizando las siguientes herramientas:

### Requisitos

* Python 3.6
* pip 9.0.3
* MongoDB v3.6.0

Para poder instalar y utilizar este proyecto, se requiere instalar las herramientas anteriores, esto puede ser mediante los siguientes links de descarga:

* https://www.python.org/downloads/
* https://pip.pypa.io/en/stable/installing/
* https://www.mongodb.com/download-center?jmp=nav#previous

También deberá descargarse el proyecto por este medio, preferentemente.

### Base de datos

La base de datos requiere de un proceso de servidor de MongoDB, el cual podemos correr ejecutando el archivo siguiente (principalmente ubicado en `C:\Program Files\MongoDB\Server\3.6\bin`):

```
mongod.exe
```

Ahora el proyecto de Flask podrá acceder a él y correr todas las funcionalidades de MongoDB.

NOTA: Asegurarse de que el servidor y el puerto en el que se ejecuta `mongod.exe` sean los mismos establecidos en el archivo de configuración de Flask (`config.py`)

### Creando un Ambiente Virtual

Lo más recomendado al momento de crear y descargar proyectos grandes como un sitio web, es generar un Ambiente Virtual (o Virtual Environment) e instalar todas las dependencias del proyecto ahí, para evitar problemas con las dependencias ya instaladas en el sistema local y con proyectos externos.

Para hacer esto, tras instalar la versión indicada de pip, se descarga la librería `virtualenv`, con el siguiente comando:

```
pip3 install virtualenv
```

Tras instalarlo, se crea un Ambiente Virtual nuevo:

```
virtualenv venv
```

Se puede reemplazar `venv` con un nombre de su preferencia, pero es comúnmente utilizado éste como estándar.

Ahora se activa el Ambiente Virtual:

#### Windows

```
venv\Scripts\activate
```

#### Linux/Mac

```
source venv/bin/activate
```

Debería mostrarse un `(venv)` del lado izquierdo de la consola. Esto significa que estamos trabajando dentro de el Ambiente Virtual y que el proceso fue un éxito.

Ahora se requiere instalar las dependencias ubicadas en `requirements.txt`. Para ello se ejecuta el siguiente comando:

```
pip install -r requirements.txt
```

Asegurarse de correr esto dentro del Ambiente Virtual, o podría haber errores entre las librerías previamente instaladas en el ordenador.

Después de esto, se especifica en el IDE de su preferencia la versión de Python utilizada. El camino usual es:

#### Windows

```
venv\Scripts\python3.exe
```

#### Linux/Mac

```
venv/bin/python3.exe
```

## Configuración

Existen diferentes credenciales y configuraciones que se requieren ingresar para el uso correcto de este proyecto.

### Gmail

Primero, para poder enviar los correos de confirmación, se requiere cambiar las variables `MAIL_USERNAME` y `MAIL_PASSWORD` del archivo `config.py` por la cuenta de Gmail que desee que envíe los correos.

En seguida, para determinar el link al cual serán dirigidos los usuarios, deberá modificarse la línea 68 del archivo `src/common/utils.py`, reemplazando `eus-heroku.herokuapp.com` por el dominio establecido en el servidor.

### MongoDB

En el archivo `src/common/database.py`, se puede cambiar la variable `URI` reemplazando el host y puerto en donde correrá el servidor de MongoDB (previamente ejecutado con `mongod.exe`). Está colocado el predeterminado (`127.0.0.1:27017`), pero es altamente recomendado que `mongod.exe` sea ejecutado con en modo privado, con un usuario y contraseña de administrador, y en un puerto distinto al predeterminado, por cuestiones de seguridad.

Más información sobre cómo crear un ambiente seguro en MongoDB:

* https://docs.mongodb.com/manual/tutorial/enable-authentication/
* https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04

También puede cambiarse el nombre de la base de datos. El establecido por defecto es `eus`, pero si se desea utilizar una con distinto nombre, deberá reemplazarse en la línea 15 de `src/common/database.py`.

### Crear un administrador para la página

Para crear un administrador para el proyecto, quien creará y monitoreará al resto de los usuarios, encuestas y noticias, se deberán modificar los valores de las líneas 17, 18, 19 y 21 del archivo `src/models/users/views.py` (siendo la variable `id` la cédula del usuario). Se ingresarán los valores deseados para el administrador, se correrá el proyecto dentro del servidor y se ingresará al link establecido `https://www.<dominio-eus>.com/crear-admin` ( reemplazando `<dominio-eus>` con el nombre del dominio donde se ejecute el proyecto), y se creará automáticamente el usuario con los datos anteriormente ingresados. Nótese que no se enviará un correo de confirmación para esto, y el usuario de administrador no podrá ser eliminado por medio de la página; deberá ser eliminado o modificado directamente desde la base de datos.

### Modo de desarrollo a modo de producción

Después de verificar que el proyecto corra exitosamente con los pasos del último punto, ya que deba subirse al servidor, es altamente recomendable modificar las variables de Flask de las líneas 5 y 6 de `config.py`, cambiándolas a `False` y `production`, respectivamente.

## Probando el proyecto

El primer paso antes de verificar que se instalara todo correctamente, es correr el servidor de MongoDB con el comando `mongod.exe`, como se mencionó anteriormente.

Ahora ejecute `run.py`:

```
python run.py
```

Debería de mostrarse un mensaje similar a éste en la consola de su CMD o IDE:

```
Running on http://0.0.0.0:5050 (Press CTRL+C to quit)
```

Abra el link en su navegador para visualizar el sitio web funcional, ¡y listo!

Cualquier duda o problema que tengan, favor de enviarme un correo a: `omar.br41@hotmail.com`