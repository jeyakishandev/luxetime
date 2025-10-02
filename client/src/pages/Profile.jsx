import React from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card } from '../components/ui'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit } from 'react-icons/fi'

const ProfileContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing[8]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const ProfileTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const ProfileCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing[6]};
`

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    text-align: center;
  }
`

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const UserEmail = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[4]};
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]};
  background: ${props => props.theme.colors.gray[800]};
  border-radius: ${props => props.theme.borderRadius.lg};
`

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[700]};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const InfoContent = styled.div`
  flex: 1;
`

const InfoLabel = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const InfoValue = styled.p`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.white};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const Profile = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <ProfileContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1>Accès non autorisé</h1>
            <p>Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </Container>
      </ProfileContainer>
    )
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <ProfileContainer>
      <Container>
        <ProfileHeader>
          <ProfileTitle>Mon Profil</ProfileTitle>
        </ProfileHeader>

        <ProfileCard>
          <ProfileInfo>
            <Avatar>
              {getInitials(user.prenom, user.nom)}
            </Avatar>
            <UserInfo>
              <UserName>{user.prenom} {user.nom}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>
            <Button variant="outline" size="sm">
              <FiEdit size={16} />
              Modifier
            </Button>
          </ProfileInfo>

          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <FiUser size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Nom complet</InfoLabel>
                <InfoValue>{user.prenom} {user.nom}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiMail size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiPhone size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Téléphone</InfoLabel>
                <InfoValue>{user.telephone || 'Non renseigné'}</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiMapPin size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Adresse</InfoLabel>
                <InfoValue>
                  {user.adresseRue && user.adresseVille 
                    ? `${user.adresseRue}, ${user.adresseVille}` 
                    : 'Non renseignée'
                  }
                </InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>
        </ProfileCard>
      </Container>
    </ProfileContainer>
  )
}

export default Profile
