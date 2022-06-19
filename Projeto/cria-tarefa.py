import requests
import json

r = requests.post("http://localhost:8002/users/login",
    json = {'username': 'pedro', 'password': '123'})
token = r.json()['token']
print("Token:" , token)


#api-server
add = requests.post("http://localhost:8001/tarefas?token=" + token,
    json = {"designacao": "consultar fisioterapeuta",
    "data": "2022-05-30",
    "responsavel": "pedro"})

#print("Tarefa criada: ", add.json())

#consultar as tarefas 
tarefas = requests.get("http://localhost:8001/tarefas?token="+ token)
print("Tarefas: ", tarefas.json())
