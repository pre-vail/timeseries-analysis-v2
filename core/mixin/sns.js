'use strict'

import ethers from 'ethers'
import {PublishCommand, SNSClient} from '@aws-sdk/client-sns'

export const sns = {
  snsClient: new SNSClient({region: 'us-east-1'}),

  snsParams: {
    PhoneNumber: process.env.AWS_SNS_PHONE_NUMBER,
    MessageAttributes: {
      'AWS.MM.SMS.OriginationNumber': {
        DataType: 'String',
        StringValue: process.env.AWS_TFN_PHONE_NUMBER
      }
    }
  },

  // log the tx args with a replacer for the big numbers
  replacer(k, v) {
    if (typeof v === 'object' && v.type === 'BigNumber' && v.hex)
      return ethers.BigNumber.from(v.hex).toString()
    else
      return v
  },

  async sendSns(message) {
    try {
      this.snsParams.Message = JSON.stringify(message, this.replacer, 1)
      const data = await this.snsClient.send(new PublishCommand(this.snsParams))
      console.log('Sent SNS', data, '\n')
    } catch (error) {
      console.error('SNS ERROR', error)
    }  
  }
}