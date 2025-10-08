import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, Input } from '../components/ui'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  padding: ${props => props.theme.spacing[8]} 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const ProfileCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]};
  }
`

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
  overflow: hidden;
`

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

const Title = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[2]};
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  letter-spacing: -0.02em;
`

const Subtitle = styled(motion.p)`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: 1.6;
`

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const Label = styled.label`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StyledInput = styled(Input)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  margin-top: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
  }
`

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresseRue: user?.adresseRue || '',
    adresseVille: user?.adresseVille || '',
    adresseCodePostal: user?.adresseCodePostal || '',
    adressePays: user?.adressePays || 'France'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      adresseRue: user?.adresseRue || '',
      adresseVille: user?.adresseVille || '',
      adresseCodePostal: user?.adresseCodePostal || '',
      adressePays: user?.adressePays || 'France'
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      // Ici on appellerait l'API pour mettre à jour le profil
      toast.success('Profil mis à jour avec succès !')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
  }

  if (!user) {
    return (
      <ProfileContainer>
        <Container>
          <ProfileCard>
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h1>Non connecté</h1>
              <p>Vous devez être connecté pour accéder à votre profil.</p>
            </div>
          </ProfileCard>
        </Container>
      </ProfileContainer>
    )
  }

  return (
    <ProfileContainer>
      <Container>
        <ProfileCard>
          <Header>
            <Avatar
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <AvatarImage 
                src="/assets/images/ChatGPT Image 2 oct. 2025, 15_35_31.png" 
                alt="Luxetime Logo" 
              />
            </Avatar>
            
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Mon Profil
            </Title>
            
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Gérez vos informations personnelles
            </Subtitle>
          </Header>

          <Form
            onSubmit={handleSave}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FormGrid>
              <InputGroup>
                <Label>Nom</Label>
                <StyledInput
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FiUser />}
                />
              </InputGroup>

              <InputGroup>
                <Label>Prénom</Label>
                <StyledInput
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FiUser />}
                />
              </InputGroup>
            </FormGrid>

            <InputGroup>
              <Label>Email</Label>
              <StyledInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<FiMail />}
              />
            </InputGroup>

            <InputGroup>
              <Label>Téléphone</Label>
              <StyledInput
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<FiPhone />}
              />
            </InputGroup>

            <InputGroup>
              <Label>Adresse</Label>
              <StyledInput
                type="text"
                name="adresseRue"
                value={formData.adresseRue}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<FiMapPin />}
              />
            </InputGroup>

            <FormGrid>
              <InputGroup>
                <Label>Ville</Label>
                <StyledInput
                  type="text"
                  name="adresseVille"
                  value={formData.adresseVille}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FiMapPin />}
                />
              </InputGroup>

              <InputGroup>
                <Label>Code postal</Label>
                <StyledInput
                  type="text"
                  name="adresseCodePostal"
                  value={formData.adresseCodePostal}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FiMapPin />}
                />
              </InputGroup>
            </FormGrid>

            <ButtonGroup>
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={handleEdit}
                  variant="primary"
                  size="lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiEdit3 size={20} />
                  Modifier le profil
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiSave size={20} />
                    Sauvegarder
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    size="lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiX size={20} />
                    Annuler
                  </Button>
                </>
              )}
              <Button
                type="button"
                onClick={handleLogout}
                variant="outline"
                size="lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Se déconnecter
              </Button>
            </ButtonGroup>
          </Form>
        </ProfileCard>
      </Container>
    </ProfileContainer>
  )
}

export default Profile