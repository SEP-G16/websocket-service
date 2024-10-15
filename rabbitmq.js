#!/usr/bin/env node

import * as amqp from 'amqplib/callback_api.js';

let rabbitMqHost = process.env.RABBITMQ_HOST || 'localhost'

export default function rabbitMessageReceiver(
  onSendOrderStatusUpdate
){
  amqp.connect(`amqp://${rabbitMqHost}`, function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'ws.direct';
  
      channel.assertExchange(exchange, 'direct', {
        durable: false
      });
  
      channel.assertQueue('', {
        exclusive: true
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
  
        channel.bindQueue(q.queue, exchange, 'sendOrderStatusUpdate');
  
        channel.consume(q.queue, function(msg) {
          onSendOrderStatusUpdate(msg.content.toString());
        }, {
          noAck: true
        });
      });
    });
  });
}