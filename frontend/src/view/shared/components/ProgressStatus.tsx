import MDBox from 'src/mui/components/MDBox';
import MDProgress from 'src/mui/components/MDProgress';
import MDTypography from 'src/mui/components/MDTypography';

const ProgressStatus = (props) => {
  const { total, completed, title, color } = props;
  const progress = Math.round(
    (100 * (completed ?? 0)) / (total || 100),
  );
  return (
    <MDBox>
      <MDBox display="flex" justifyContent="space-between">
        <MDTypography
          variant="caption"
          color="text"
          fontWeight="regular"
        >
          {title}
        </MDTypography>
        <MDTypography
          variant="caption"
          color="text"
          fontWeight="regular"
        >
          {progress}%
        </MDTypography>
      </MDBox>
      <MDProgress
        color={color ?? 'success'}
        value={progress}
      />
    </MDBox>
  );
};

export default ProgressStatus;
