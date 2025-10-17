import React, { useState } from 'react';
import { productsAPI } from '../services/api';

const ReportButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const downloadReport = async (format: 'pdf' | 'csv') => {
    setLoading(true);
    try {
      const response = await productsAPI.generateReport(format);
      
      // Criar URL do blob
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv',
      });
      const url = window.URL.createObjectURL(blob);
      
      // Criar link temporário para download
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_estoque.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>📊</div>
          <div>
            <h3 style={styles.title}>Relatórios</h3>
            <p style={styles.description}>
              Exporte dados do estoque em PDF ou CSV
            </p>
          </div>
        </div>

        <div style={styles.buttons}>
          <button
            onClick={() => downloadReport('pdf')}
            disabled={loading}
            style={styles.pdfButton}
          >
            {loading ? '⏳' : '📄'} Baixar PDF
          </button>
          
          <button
            onClick={() => downloadReport('csv')}
            disabled={loading}
            style={styles.csvButton}
          >
            {loading ? '⏳' : '📋'} Baixar CSV
          </button>
        </div>

        <div style={styles.info}>
          <p style={styles.infoText}>
            💡 O relatório inclui todos os produtos cadastrados com informações
            de estoque, preços e valores totais.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  icon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#f0f9ff',
    color: '#0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap' as const,
  },
  pdfButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    flex: 1,
    minWidth: '140px',
    justifyContent: 'center',
  },
  csvButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    flex: 1,
    minWidth: '140px',
    justifyContent: 'center',
  },
  info: {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  infoText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4',
  },
};

export default ReportButton;