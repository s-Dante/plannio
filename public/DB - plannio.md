DB - plannio

users
    name
    father_lastname
    mother_lastname
    profile_picture
    caption
    feeling_status
    accent_color
    username
    email
    birthdate
    country
    pswd

places
    ubication (maybe latitutde, longitude)
    user_id (wich user made the post)
    rating
    category

rewards
    (all the rewards are (badges and frames) so to get them the user needs to get points, so each reward is based on points)
    
friends
    this table is a pivot table that stores the users wich are friend
        it should be cool to work it like graph teory
    person_one
    person_two

groups
    it could work for individual chats or groups chats
    encription (boolean)

    

messages
    user_id
    text


multimedia
    user_id
    group_id
    type
    file
    mime
    size


chores
    title
    decription




Funcionalidades por hacer
✅  -> Landing Page
⚠️  -> Auth ✅
✅      -> login
✅      -> register (seleccionar pais con json de paises, validacion de la edad,
                    validacion de contraseña, cambiar date input por uno de shadcn)
✅      -> changePswd
❌      -> APIs Sociales
❌          -> funcion de registro y signin con google, fb, gh
⚠️  -> Perfil
⚠️      -> Modal: que funcione el toggle light mode
✅      -> Funcion de edicion de datos personales
✅      -> Funcion de cambio de contraseña
✅      -> Funcion de toggle light mode
❌  -> Chats
✅      -> Funcionalidad de buscar usuarios para solicitar su amistad
✅          -> Sus amigos automaticamente generan un chat individual
✅      -> Funcionalidad de crear un grupo en base a sus amigos (100 users max)
❌      -> Funcionalidad de mandar mensajes 
❌          -> Automaticamente se encriptan los mensajes, el usuairo decide si
            prefiere que se envien sin encriptacion
❌          -> Funcionalidad de envio de contenido multimedia (fotos, videos,
            audios, documentos)
❌          -> Funcionalidad de permitir emojis en el mensaje
❌          -> Funcionalidad de permitir enviar la ubicacion del usuario
❌          -> Permitir llamadas (chats individuales y grupales)
❌          -> Permitir videollamadas (chats individuales y grupales)
❌          -> Funcionalidad para añadir tareas (chats individuales y grupales)
❌              -> Funcionalidad para ver como se deben de gestionar las tareas
                para marcar que se finalizaron
❌  -> Lugares
✅      -> Funcion de que el usuario pueda añadir lugares interesantes para el
✅      -> Funcion de rating a cada lugar
✅      -> Funcion de que el mapa permita visualizar donde se encuentra el lugar
❌  -> Recompenzas
❌      -> Sistema para ganar las recompenzas 
❌      -> Sistema de visualizacion de recompenzas