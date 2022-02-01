import { Router } from 'express';
import { Certificate } from '../models/certificate';
import CertificateService from '../services/certificate';
import { JwtUtils } from '../utils/jwt';


const router = Router();

router.get('/:regNo', async (req, res) => {
    const regNo = req.params.regNo;
    const certificate = await CertificateService.findByRegNo(regNo);
    res.json(certificate);
});

router.get('', async (req, res) => {
    const groupId = Number.parseInt(req.query['group_id'] as string || '');
    const certificates = await CertificateService.findByGroupId(groupId);
    res.json(certificates);
});

router.put('/:regNo', async (req, res) => {
    const regNo = req.params.regNo;
    const certificate: Certificate = req.body;
    await JwtUtils.authorizeGroup(req, certificate.group);
    certificate.regNo = regNo;
    await CertificateService.create(certificate);
    res.sendStatus(201);
});

export default router;