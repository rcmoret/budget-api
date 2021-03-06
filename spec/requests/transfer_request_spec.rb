# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'transfer requests' do
  before { allow(Secret).to receive(:key).and_return('') }

  describe 'index' do
    before { FactoryBot.create_list(:transfer, 11) }

    let(:endpoint) { '/transfers' }
    let(:response) { get endpoint, params }

    context 'empty params' do
      let(:params) { {} }

      subject { JSON.parse(response.body) }

      it 'returns 10 transfers by default' do
        expect(subject['transfers'].size).to be 10
      end

      it 'returns some metadata' do
        expect(subject['metadata']['limit']).to be 10
        expect(subject['metadata']['offset']).to be 0
        expect(subject['metadata']['viewing']).to eq [1, 10]
        expect(subject['metadata']['total']).to be 11
      end

      it 'returns an array of transfers' do
        expect(subject['transfers'].count).to be 10
      end
    end

    context 'per_page => 5' do
      let(:params) { { per_page: 5 } }

      subject { JSON.parse(response.body) }

      it 'returns 5 transfers when specified' do
        expect(subject['transfers'].size).to be 5
      end

      it 'returns some metadata' do
        expect(subject['metadata']['limit']).to be 5
        expect(subject['metadata']['offset']).to be 0
        expect(subject['metadata']['viewing']).to eq [1, 5]
        expect(subject['metadata']['total']).to be 11
      end
    end

    context 'page => 1' do
      let(:params) { { page: 1 } }

      subject { JSON.parse(response.body) }

      it 'returns the next transfers when page specified' do
        expect(subject['transfers'].size).to be 10
      end

      it 'returns some metadata' do
        expect(subject['metadata']['limit']).to be 10
        expect(subject['metadata']['offset']).to be 0
        expect(subject['metadata']['viewing']).to eq [1, 10]
        expect(subject['metadata']['total']).to be 11
      end
    end

    context 'page => 2' do
      let(:params) { { page: 2 } }

      subject { JSON.parse(response.body) }

      it 'returns the next transfers when page specified' do
        expect(subject['transfers'].size).to be 1
      end

      it 'returns some metadata' do
        expect(subject['metadata']['limit']).to be 10
        expect(subject['metadata']['offset']).to be 10
        expect(subject['metadata']['viewing']).to eq [11, 11]
        expect(subject['metadata']['total']).to be 11
      end
    end

    context 'per_page => 5, page => 2' do
      let(:params) { { per_page: 5, page: 2 } }

      subject { JSON.parse(response.body) }

      it 'returns 5 transfers when specified' do
        expect(subject['transfers'].size).to be 5
      end

      it 'returns some metadata' do
        expect(subject['metadata']['limit']).to be 5
        expect(subject['metadata']['offset']).to be 5
        expect(subject['metadata']['viewing']).to eq [6, 10]
        expect(subject['metadata']['total']).to be 11
      end
    end
  end

  describe 'post' do
    let(:endpoint) { '/transfers' }
    let(:checking_account) { FactoryBot.create(:account) }
    let(:savings_account) { FactoryBot.create(:account) }
    let(:from_account_id) { checking_account.id }
    let(:to_account_id) { savings_account.id }
    let(:amount) { (100..1000).to_a.sample }
    let(:body) do
      {
        to_account_id: to_account_id,
        from_account_id: from_account_id,
        amount: amount
      }
    end

    subject { post endpoint, body }

    context 'happy path' do
      it 'returns a 201' do
        expect(subject.status).to be 201
      end

      it 'creates a transfer record' do
        expect { subject }.to change { Transfer.count }.by(+1)
      end

      it 'creates to transaction records' do
        expect { subject }.to change { Transaction::Entry.count }.by(+2)
      end

      it 'returns a hash with to transaction information: account name' do
        expect(JSON.parse(subject.body)['to_transaction']['account_name'])
          .to eq savings_account.name
      end

      it 'returns a hash with to transaction information: amount' do
        expect(
          JSON.parse(subject.body).dig('to_transaction', 'details', 0, 'amount')
        ).to be amount
      end

      it 'returns a hash with to transaction information: clearance date' do
        info = JSON.parse(subject.body)['to_transaction']
        expect(info.fetch('clearance_date')).to be nil
      end

      it 'returns a hash with from transaction information: account name' do
        expect(JSON.parse(subject.body)['from_transaction']['account_name'])
          .to eq checking_account.name
      end

      it 'returns a hash with from transaction information: amount' do
        expect(
          JSON.parse(subject.body)
          .dig('from_transaction', 'details', 0, 'amount')
        ).to be(-1 * amount)
      end

      it 'returns a hash with from transaction information: clearance date' do
        info = JSON.parse(subject.body)['from_transaction']
        expect(info.fetch('clearance_date')).to be nil
      end
    end

    context 'looking for an "to_account" that does not exist' do
      let(:to_account_id) { "1#{savings_account.id}0" }
      it 'returns a 404' do
        expect(subject.status).to be 404
      end

      it 'responds with an error message' do
        expect(JSON.parse(subject.body)['errors'])
          .to include({ 'account' => ["Could not find a(n) account with id: #{to_account_id}"] })
      end
    end

    context 'looking for an "from_account" that does not exist' do
      let(:from_account_id) { "1#{checking_account.id}0" }
      it 'returns a 404' do
        expect(subject.status).to be 404
      end

      it 'responds with an error message' do
        expect(JSON.parse(subject.body)['errors'])
          .to include({ 'account' => ["Could not find a(n) account with id: #{from_account_id}"] })
      end
    end

    context 'amount is not passed' do
      let(:body) do
        { to_account_id: to_account_id, from_account_id: from_account_id }
      end

      it 'returns a 422' do
        expect(subject.status).to be 422
      end

      it 'responds with an error message' do
        expect(JSON.parse(subject.body)['errors']).to include('amount' => ['not provided'])
      end
    end
  end

  describe 'delete' do
    let!(:transfer) { FactoryBot.create(:transfer) }

    subject { delete "/transfers/#{transfer.id}" }

    it 'deletes the transfer record' do
      expect { subject }.to change { Transfer.count }.by(-1)
    end

    it 'deletes the transactions too' do
      expect { subject }.to change { Transaction::Entry.count }.by(-2)
    end

    it 'returns a 204' do
      expect(subject.status).to be 204
    end

    it 'returns an empty body' do
      expect(subject.body). to be_empty
    end

    context 'bad id' do
      subject { delete "/transfers/1#{transfer.id}" }

      it 'returns a 404' do
        expect(subject.status).to be 404
      end

      it 'includes an error message' do
        expect(JSON.parse(subject.body)['errors'])
          .to include({ 'transfer' => ["Could not find a(n) transfer with id: 1#{transfer.id}"] })
      end
    end
  end
end
