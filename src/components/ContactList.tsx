import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [editingContact, setEditingContact] = useState<any>(null);

  const handleSubmit = (data: any) => {
    if (editingContact) {
      // Update existing contact
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...data }
          : contact
      ));
      setEditingContact(null);
    } else {
      // Add new contact
      setContacts([...contacts, { id: Date.now(), ...data }]);
    }
    setShowForm(false);
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
        <button
          onClick={() => {
            setEditingContact(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Cadastrar Contato
        </button>
      </div>

      {showForm ? (
        <ContactForm 
          onSubmit={handleSubmit} 
          onCancel={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
          initialData={editingContact}
          isEditing={!!editingContact}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum contato cadastrado
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{contact.whatsapp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{contact.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactList;