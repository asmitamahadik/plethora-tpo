import { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Empty, List, Modal, Tag, message } from 'antd';
import { listDrives } from '../../api/drives';
import { applyToDrive, myApplications } from '../../api/applications';
import BackButton from '../../components/BackButton';
import PageHeader from '../../components/PageHeader';

export default function DriveList() {
  const [drives, setDrives] = useState([]);
  const [applied, setApplied] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);

  const load = () => {
    listDrives().then(setDrives).catch(() => {});
    myApplications().then((apps) => setApplied(new Set(apps.map((a) => a.driveId)))).catch(() => {});
  };

  useEffect(load, []);

  const handleApply = async (driveId) => {
    setApplying(true);
    try {
      await applyToDrive(driveId);
      message.success('Application submitted!');
      setSelected(null);
      load();
    } catch (err) {
      message.error(err.response?.data?.message || 'Could not apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <BackButton />
      <PageHeader title="Placement Drives" subtitle="Drives you're eligible to apply to" />
      {drives.length === 0 ? (
        <Empty description="No open drives match your profile right now" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={drives}
          renderItem={(drive) => (
            <List.Item>
              <Card
                title={drive.title}
                extra={<Tag color="blue">{drive.companyName}</Tag>}
                actions={[
                  <Button key="view" type="link" onClick={() => setSelected(drive)}>View details</Button>,
                  applied.has(drive.id) ? (
                    <Tag key="status" color="green">Applied</Tag>
                  ) : (
                    <Button key="apply" type="primary" size="small" onClick={() => handleApply(drive.id)}>
                      Apply
                    </Button>
                  ),
                ]}
              >
                <p>CTC: {drive.ctcPackage ? `₹${drive.ctcPackage} LPA` : 'Not disclosed'}</p>
                <p>Min CGPA: {drive.minCgpa}</p>
                <p>Deadline: {drive.applicationDeadline || 'Rolling'}</p>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={selected?.title}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={
          selected && !applied.has(selected.id)
            ? [
                <Button key="apply" type="primary" loading={applying} onClick={() => handleApply(selected.id)}>
                  Apply Now
                </Button>,
              ]
            : null
        }
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Company">{selected.companyName}</Descriptions.Item>
            <Descriptions.Item label="Description">{selected.jobDescription}</Descriptions.Item>
            <Descriptions.Item label="CTC">{selected.ctcPackage ? `₹${selected.ctcPackage} LPA` : 'Not disclosed'}</Descriptions.Item>
            <Descriptions.Item label="Min CGPA">{selected.minCgpa}</Descriptions.Item>
            <Descriptions.Item label="Eligible departments">{selected.allowedDepartments}</Descriptions.Item>
            <Descriptions.Item label="Max backlogs">{selected.maxBacklogs}</Descriptions.Item>
            <Descriptions.Item label="Application deadline">{selected.applicationDeadline || 'Rolling'}</Descriptions.Item>
            <Descriptions.Item label="Drive date">{selected.driveDate || 'TBD'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
