import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import datetime
import json
import asyncio
import time
import threading

asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


class WSHandler(tornado.websocket.WebSocketHandler):
    clients = []
    clients_name = {}

    def open(self):
        self.write_message(
            '{"type":"chat", "chat":"' + "\\n서버와 연결을 성공했습니다." + '"}'
        )
        WSHandler.clients.append(self)

    def on_message(self, message):
        if message.startswith('{"type":"name"'):
            data = json.loads(message)
            if data["name"] in WSHandler.clients_name.values():
                self.write_message(
                    '{"type":"chat", "chat":"\\n[Server] 중복 닉네임이 확인되어 접속이 종료됩니다.\\n 새로고침 후 다른 닉네임을 사용해보세요."}'
                )
                self.close()
            else:
                WSHandler.clients_name[self] = data["name"]
                show_ip = data["name"]
                print(
                    "\n[{}] {} 님이 연결했습니다. 현재 접속 인원수는 {}입니다.\n".format(
                        str(datetime.datetime.now()),
                        data["name"],
                        len(WSHandler.clients),
                    )
                )

                for i in WSHandler.clients:
                    i.write_message(
                        '{"type":"chat", "chat":"'
                        + "\\n["
                        + str(datetime.datetime.now())
                        + "]  "
                        + show_ip
                        + "님이 연결했습니다. 현재 접속 인원수는 %s명입니다.\\n"
                        % (len(WSHandler.clients))
                        + '"}'
                    )

        elif message.startswith('{"type":"chat"'):
            data = json.loads(message)
            message = data["chat"]
            print(
                "["
                + str(datetime.datetime.now())
                + "]  "
                + WSHandler.clients_name[self]
                + " : "
                + message
            )
            show_ip = WSHandler.clients_name[self]

            for i in WSHandler.clients:
                i.write_message(
                    '{"type":"chat", "chat":"['
                    + str(datetime.datetime.now())
                    + "]  "
                    + show_ip
                    + " : "
                    + message
                    + '"}'
                )

    def on_close(self):
        WSHandler.clients.remove(self)

        print(
            "\n["
            + str(datetime.datetime.now())
            + "]  "
            + WSHandler.clients_name[self]
            + "님의 연결이 해제되었습니다. 현재 접속 인원수는 %s명입니다.\n" % (len(WSHandler.clients))
        )
        show_ip = WSHandler.clients_name[self]

        for i in WSHandler.clients:
            i.write_message(
                '{"type":"chat", "chat":"'
                + "\\n["
                + str(datetime.datetime.now())
                + "]  "
                + show_ip
                + "님의 연결이 해제되었습니다. 현재 접속 인원수는 %s명입니다.\\n"
                % (len(WSHandler.clients))
                + '"}'
            )
        del WSHandler.clients_name[self]

    def check_origin(self, origin):
        return True


application = tornado.web.Application([(r"/", WSHandler),])

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8000)
    print(
        """
        ### 채팅 서버가 성공적으로 실행되었어요.
              https://github.com/khk4912
    """
    )
    tornado.ioloop.IOLoop.instance().start()
