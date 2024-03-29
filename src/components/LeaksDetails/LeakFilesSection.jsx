import React from 'react'
import {
  FileImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { shortenEthAddress } from '@/utils/helpers'
const styles = {
  noFiles: {
    fontSize: '15px',
    color: '#ffffff',
  },
  fileIcon: {
    fontSize: '35px',
    marginRight: '10px',
    color: '#ffffff',
  },
  title: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff',
    paddingBottom: '10px'
  },
  fileRow: {
    margin: '10px 0',
    display: 'flex',
  },
  fileMetadata: {
    color: '#ffffff',
  },
  fileName: {
    fontSize: '15px',
    color: '#ffffff',
  },
  fileMetadata: {
    color: '#ffffff',
    fontSize: '10px'
  },
  fileDownloadIcon: {
    marginLeft: 'auto',
    fontSize: '30px',
    color: '#ffffff',
  }
}

function LeakFilesSection({ files }) {

  const fileIconGenerator = (fileType) => {
    if (fileType.includes('image')) {
      return <FileImageOutlined />
    }
    if (fileType.includes('video')) {
      return <VideoCameraOutlined />
    }
    if (fileType.includes('audio')) {
      return <AudioOutlined />
    }
    if (fileType.includes('pdf')) {
      return <FilePdfOutlined />
    }
    if (fileType.includes('doc')) {
      return <FileWordOutlined />
    }
    if (fileType.includes('docx')) {
      return <FileWordOutlined />
    }
    if (fileType.includes('xls')) {
      return <FileExcelOutlined />
    }
    if (fileType.includes('xlsx')) {
      return <FileExcelOutlined />
    }
    if (fileType.includes('ppt')) {
      return <FilePptOutlined />
    }
    if (fileType.includes('pptx')) {
      return <FilePptOutlined />
    }
    if (fileType.includes('zip')) {
      return <FileZipOutlined />
    }
    return <FileUnknownOutlined />
  }

  return (
    <div className='leak-file-container' style={{ marginTop: '30px' }}>
      <div className='leak-file-title' style={styles.title}>
        Resources :
      </div>

      <div className='files-section'>
        {
          files && files.length > 0 ? (
            files.map((file, index) => (
              <div className='file-row' key={index} style={styles.fileRow}>
                <div className='file-icon' style={styles.fileIcon}>
                  {fileIconGenerator(file?.type)}
                </div>

                <div className='file-metadata' style={styles.fileMetadata}>
                  <div className='file-name' style={styles.fileName}>
                    {shortenEthAddress(file?.name || '', 13, 40)}
                  </div>
                  <div className='file-type' style={styles.fileMetadata}>
                    {file?.type}
                  </div>
                  <div className='file-size' style={styles.fileMetadata}>
                    {parseFloat(file?.sizeInKb || 0).toFixed()} KB
                  </div>
                </div>

                <div className='file-download-icon' style={styles.fileDownloadIcon}>
                  <Link
                    target={'_blank'}
                    href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${file?.cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`} download>
                    <CloudDownloadOutlined />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className='no-files' style={styles.noFiles}>
              No resources found
            </div>
          )
        }

      </div>
    </div>
  )
}

export default LeakFilesSection
