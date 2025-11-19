import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { productAPI, orderAPI } from '../services/api'
import { Button, Card, PageLoading } from '../components/ui'
import { 
  FiPackage, 
  FiShoppingBag, 
  FiBarChart2, 
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  padding: ${props => props.theme.spacing[8]} 0;
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
`

const AdminHeader = styled(motion.div)`
  margin-bottom: ${props => props.theme.spacing[8]};
  text-align: center;
`

const AdminTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[2]};
`

const AdminSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.lg};
`

const TabsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Tab = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: ${props => props.$active ? props.theme.fontWeights.semibold : props.theme.fontWeights.normal};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const AdminCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.spacing[6]};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background: rgba(255, 255, 255, 0.05);
`

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing[4]};
  text-align: left;
  color: ${props => props.theme.colors.gray[300]};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.sm};
`

const TableCell = styled.td`
  padding: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`

const ActionButton = styled(Button)`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
`

const StatCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
`

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const StatLabel = styled.div`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const Admin = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('products')

  // Vérifier si l'utilisateur est admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (user?.role !== 'ADMIN') {
      toast.error('Accès refusé. Droits administrateur requis.')
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  // Récupérer les produits
  const { data: productsData, isLoading: isLoadingProducts } = useQuery(
    ['admin-products'],
    () => productAPI.getProducts({ limit: 100 }),
    {
      enabled: activeTab === 'products' && isAuthenticated && user?.role === 'ADMIN'
    }
  )

  // Récupérer les commandes
  const { data: ordersData, isLoading: isLoadingOrders } = useQuery(
    ['admin-orders'],
    () => orderAPI.getAllOrders(),
    {
      enabled: activeTab === 'orders' && isAuthenticated && user?.role === 'ADMIN'
    }
  )

  // Supprimer un produit
  const deleteProduct = useMutation(
    (id) => productAPI.deleteProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-products'])
        toast.success('Produit supprimé avec succès')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression')
      }
    }
  )

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = useMutation(
    ({ id, statut }) => orderAPI.updateOrderStatus(id, statut),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-orders'])
        toast.success('Statut de la commande mis à jour')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour')
      }
    }
  )

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  const products = productsData?.data?.data?.products || []
  const orders = ordersData?.data?.data || []

  return (
    <AdminContainer>
      <Container>
        <AdminHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AdminTitle>Panel Administrateur</AdminTitle>
          <AdminSubtitle>Gérez vos produits et commandes</AdminSubtitle>
        </AdminHeader>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatValue>{products.length}</StatValue>
            <StatLabel>Produits</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatValue>{orders.length}</StatValue>
            <StatLabel>Commandes</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatValue>{orders.filter(o => o.statut === 'EN_ATTENTE').length}</StatValue>
            <StatLabel>En attente</StatLabel>
          </StatCard>
        </StatsGrid>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
          >
            <FiPackage style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Produits
          </Tab>
          <Tab 
            $active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Commandes
          </Tab>
        </TabsContainer>

        {activeTab === 'products' && (
          <AdminCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 600 }}>Gestion des produits</h2>
              <Button
                variant="primary"
                onClick={() => navigate('/admin/products/new')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={18} style={{ marginRight: '8px' }} />
                Nouveau produit
              </Button>
            </div>

            {isLoadingProducts ? (
              <PageLoading text="Chargement des produits..." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Nom</TableHeaderCell>
                    <TableHeaderCell>Prix</TableHeaderCell>
                    <TableHeaderCell>Stock</TableHeaderCell>
                    <TableHeaderCell>Catégorie</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.nom}</TableCell>
                      <TableCell>{formatPrice(product.prix)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.categorie}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            <FiEye size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          >
                            <FiEdit size={14} />
                          </ActionButton>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                                deleteProduct.mutate(product.id)
                              }
                            }}
                          >
                            <FiTrash2 size={14} />
                          </ActionButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </AdminCard>
        )}

        {activeTab === 'orders' && (
          <AdminCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Gestion des commandes</h2>

            {isLoadingOrders ? (
              <PageLoading text="Chargement des commandes..." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Numéro</TableHeaderCell>
                    <TableHeaderCell>Client</TableHeaderCell>
                    <TableHeaderCell>Total</TableHeaderCell>
                    <TableHeaderCell>Statut</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.numero}</TableCell>
                      <TableCell>{order.client?.prenom} {order.client?.nom}</TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: order.statut === 'LIVREE' ? 'rgba(34, 197, 94, 0.2)' :
                                     order.statut === 'EN_ATTENTE' ? 'rgba(251, 191, 36, 0.2)' :
                                     'rgba(239, 68, 68, 0.2)',
                          color: order.statut === 'LIVREE' ? '#22c55e' :
                                 order.statut === 'EN_ATTENTE' ? '#fbbf24' :
                                 '#ef4444'
                        }}>
                          {order.statut}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <ActionButton
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            <FiEye size={14} />
                          </ActionButton>
                          {order.statut === 'EN_ATTENTE' && (
                            <ActionButton
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                if (window.confirm('Confirmer cette commande ?')) {
                                  updateOrderStatus.mutate({ id: order.id, statut: 'CONFIRMEE' })
                                }
                              }}
                            >
                              <FiCheck size={14} />
                            </ActionButton>
                          )}
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </AdminCard>
        )}
      </Container>
    </AdminContainer>
  )
}

export default Admin

